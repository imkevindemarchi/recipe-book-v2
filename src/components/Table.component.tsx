import React, { FC } from "react";
import { useTranslation } from "react-i18next";

// Icons
import { ArrowLeftIcon, ArrowRightIcon, DeleteIcon } from "../assets/icons";

export type TColumn = {
  key: string;
  value: string;
};

interface IInfo {
  page: number;
  total: number;
}

interface IProps {
  columns: TColumn[];
  isDarkMode: boolean;
  data: any[] | null;
  total: number;
  onGoPreviousPage: () => Promise<void>;
  onGoNextPage: () => Promise<void>;
  info: IInfo;
  isLoading: boolean;
  onDelete?: (data: any) => void;
  onRowClick?: (data: any) => void;
}

function approximateByExcess(number: number): number {
  return Math.ceil(number);
}

const Table: FC<IProps> = ({
  data,
  columns,
  isDarkMode,
  total,
  onGoPreviousPage,
  onGoNextPage,
  info,
  isLoading,
  onDelete,
  onRowClick,
}) => {
  const { t } = useTranslation();

  const canGoPrevious: boolean = info.page > 1;
  const totalPages: number = approximateByExcess(info.total / 5);
  const canGoNext: boolean = info.page < totalPages;

  return data && data?.length > 0 ? (
    <div className="mobile:overflow-x-scroll relative">
      <table className="w-full">
        <thead className="w-full">
          <tr>
            {onDelete && <th />}
            {columns.map((column: TColumn, index: number) => {
              return (
                <th key={index} className="p-2 text-left">
                  <span
                    className={`transition-all duration-300 whitespace-nowrap ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {column.value}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data?.map((item: any, index: number) => {
            return (
              <tr
                key={index}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-all duration-300 hover:bg-primary-transparent border-b-2 ${
                  isDarkMode ? "border-darkgray" : "border-lightgray"
                } ${onRowClick && "cursor-pointer"}`}
              >
                {onDelete && (
                  <td className="mobile:p-2">
                    <DeleteIcon
                      onClick={(event: any) => {
                        event.stopPropagation();
                        onDelete(item);
                      }}
                      className="text-2xl text-primary cursor-pointer hover:opacity-50 transition-all duration-300 mobile:text-3xl"
                    />
                  </td>
                )}
                {columns.map((column: TColumn, index2: number) => {
                  const isEmail: boolean = column.key === "email";
                  const isImageColumn: boolean = column.key === "image";

                  return isImageColumn ? (
                    <td key={index2} className="p-2">
                      <div className="w-40 flex justify-center items-center p-5">
                        <img
                          src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${item?.id}`}
                          alt={t("imgNotFound")}
                          className="w-full h-full rounded-xl"
                        />
                      </div>
                    </td>
                  ) : (
                    <td key={index2} className="p-2 whitespace-nowrap">
                      <span
                        className={`transition-all duration-300 ${
                          isEmail
                            ? "text-primary"
                            : isDarkMode
                            ? "text-lightgray"
                            : "text-darkgray"
                        }`}
                      >
                        {item[column.key]}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="py-5 px-2 flex justify-between items-center sticky bottom-0 left-0 right-0">
        <div className="flex gap-1">
          <span
            className={`font-bold transition-all duration-300 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {t("total")}
          </span>
          <span className="font-bold text-primary">{total}</span>
        </div>
        <div className="flex flex-row w-[7%] justify-between mobile:w-[30%]">
          <button
            disabled={!canGoPrevious}
            onClick={async () => await onGoPreviousPage()}
            className={`flex justify-center items-center w-10 h-10 p-2 rounded-lg transition-all duration-300 ${
              !canGoPrevious && isDarkMode
                ? "bg-darkgray"
                : !canGoPrevious
                ? "bg-lightgray"
                : "bg-primary-transparent hover:opacity-50 mobile:hover:opacity-100"
            }`}
          >
            <ArrowLeftIcon
              className={`text-3xl ${
                !canGoPrevious && isDarkMode
                  ? "text-darkgray2"
                  : !canGoPrevious
                  ? "text-gray"
                  : "text-primary"
              }`}
            />
          </button>
          <button
            disabled={!canGoNext}
            onClick={async () => await onGoNextPage()}
            className={`flex justify-center items-center w-10 h-10 p-2 rounded-lg transition-all duration-300 ${
              !canGoNext && isDarkMode
                ? "bg-darkgray"
                : !canGoNext
                ? "bg-lightgray"
                : "bg-primary-transparent hover:opacity-50 mobile:hover:opacity-100"
            }`}
          >
            <ArrowRightIcon
              className={`text-3xl ${
                !canGoNext && isDarkMode
                  ? "text-darkgray2"
                  : !canGoNext
                  ? "text-gray"
                  : "text-primary"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  ) : !isLoading && data ? (
    <div className="flex justify-center">
      <span
        className={`transition-all duration-300 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {t("noData")}
      </span>
    </div>
  ) : null;
};

export default Table;
