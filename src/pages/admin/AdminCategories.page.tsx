import React, { FC, ReactNode, useContext, useEffect, useState } from "react";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";

// Api
import { CATEGORY_API, IMAGES_API } from "../../api";

// Assets
import { useTranslation } from "react-i18next";

// Components
import { Button, Card, Input, Modal, Table } from "../../components";

// Contexts
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/popup.provider";
import { ThemeContext, TThemeContext } from "../../providers/theme.provider";

// Icons
import { AddIcon, SearchIcon } from "../../assets/icons";

// Types
import { THTTPResponse } from "../../types";
import { TCategory } from "../../types/category.type";
import { TColumn } from "../../components/Table.component";

// Utils
import { setPageTitle } from "../../utils";

interface ITableData {
  from: number;
  to: number;
  total: number;
  page: number;
  label: string;
}

const AdminCategories: FC = () => {
  const { t } = useTranslation();
  const { state: isLoading, setState: setIsLoading }: TLoaderContext =
    useContext(LoaderContext) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [tableData, setTableData] = useState<TCategory[] | null>(null);
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const [searchParams, setSearchParams] = useSearchParams({});
  const tableDefaultState: ITableData = {
    from: parseInt(searchParams.get("from") as string) || 0,
    to: parseInt(searchParams.get("to") as string) || 4,
    total: parseInt(searchParams.get("total") as string) || 0,
    page: parseInt(searchParams.get("page") as string) || 1,
    label: searchParams.get("label") || "",
  };
  const [table, setTable] = useState<ITableData>(tableDefaultState);
  const navigate: NavigateFunction = useNavigate();
  const { pathname } = useLocation();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(
    null
  );

  const pageTitle: string = t("categories");
  const selectedCategoryId: string = selectedCategory?.id as string;

  setPageTitle(pageTitle);

  const talbeColumns: TColumn[] = [
    { key: "label", value: t("name") },
    { key: "image", value: t("image") },
  ];

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(
      CATEGORY_API.getAllWithFilters(table.from, table.to, table.label)
    ).then((response: THTTPResponse) => {
      if (response && response.hasSuccess) {
        setTableData(response.data);
        setTable((prevState) => {
          return { ...prevState, total: response?.totalRecords as number };
        });
      } else openPopup(t("unableLoadCategories"), "error");
    });

    setIsLoading(false);
  }

  async function tableOnGoPreviousPage(): Promise<void> {
    setTable((prevState) => {
      return {
        ...prevState,
        page: table.page - 1,
        from: table.from - 5,
        to: table.to - 5,
      };
    });
  }

  async function tableOnGoNextPage(): Promise<void> {
    setTable((prevState) => {
      return {
        ...prevState,
        page: table.page + 1,
        from: table.from + 5,
        to: table.to + 5,
      };
    });
  }

  async function tableOnDelete(rowData: any): Promise<void> {
    setDeleteModal(true);
    setSelectedCategory(rowData);
  }

  async function onDelete(): Promise<void> {
    setDeleteModal(false);
    setIsLoading(true);

    await Promise.resolve(CATEGORY_API.delete(selectedCategoryId)).then(
      async (categoryRes: THTTPResponse) => {
        if (categoryRes && categoryRes.hasSuccess) {
          await Promise.resolve(IMAGES_API.delete(selectedCategoryId)).then(
            (imageRes: THTTPResponse) => {
              if (imageRes && imageRes.hasSuccess) {
                openPopup(t("categoryDeleted"), "success");
                getData();
              }
            }
          );
        } else openPopup(t("unableDeleteCategory"), "error");
      }
    );

    setIsLoading(false);
  }

  function tableOnRowClick(rowData: any): void {
    navigate(`${pathname}/edit/${rowData.id}`);
  }

  const title: ReactNode = (
    <span className="text-primary text-2xl">{pageTitle}</span>
  );

  const deleteModalComponent: ReactNode = (
    <Modal
      title={t("deleteCategory")}
      isOpen={deleteModal}
      onClose={() => setDeleteModal(false)}
      onSubmit={onDelete}
      onCancel={() => setDeleteModal(false)}
      submitBtnText={t("yes")}
      cancelBtnText={t("no")}
      isDarkMode={isDarkMode}
    >
      <span
        className={`transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {t("confirmToDelete", { name: selectedCategory?.label })}
      </span>
    </Modal>
  );

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, [table.from, table.to]);

  useEffect(() => {
    setSearchParams({
      label: table.label,
      from: table.from,
      to: table.to,
      page: table.page,
    } as any);

    // eslint-disable-next-line
  }, [table.label, table.from, table.to, table.page]);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-5">
        {title}
        <div className="flex flex-col gap-5">
          <div className="flex justify-end">
            <div className="flex flex-row items-center gap-5 mobile:w-full">
              <Input
                autofocus
                value={table.label}
                onChange={(value: string) =>
                  setTable((prevState) => {
                    return {
                      ...prevState,
                      label: value,
                      from: 0,
                      to: 4,
                      page: 1,
                    };
                  })
                }
                icon={<SearchIcon className="text-primary text-2xl" />}
                placeholder={t("name")}
                isDarkMode={isDarkMode}
                onSearch={getData}
                width="100%"
              />
              <div>
                <Button
                  onClick={() => navigate(`${pathname}/new`)}
                  styleType="round"
                >
                  <AddIcon className="text-white text-2xl" />
                </Button>
              </div>
            </div>
          </div>
          <Card isDarkMode={isDarkMode}>
            <Table
              data={tableData}
              columns={talbeColumns}
              isDarkMode={isDarkMode}
              total={table.total}
              onGoPreviousPage={tableOnGoPreviousPage}
              onGoNextPage={tableOnGoNextPage}
              info={table}
              isLoading={isLoading}
              onDelete={tableOnDelete}
              onRowClick={tableOnRowClick}
            />
          </Card>
        </div>
      </div>
      {deleteModalComponent}
    </>
  );
};

export default AdminCategories;
