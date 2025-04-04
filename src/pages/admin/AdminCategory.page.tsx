import React, {
  FC,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate, useParams } from "react-router";

// Api
import { CATEGORY_API, IMAGES_API } from "../../api";

// Components
import {
  Breadcrumb,
  Button,
  Card,
  ImageSelector,
  Input,
} from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/popup.provider";

// Icons
import { ResetIcon, SaveIcon } from "../../assets/icons";

// Types
import { TCategory } from "../../types/category.type";
import { THTTPResponse } from "../../types";
import {
  TValidation,
  validateFormField,
  validateFormImage,
} from "../../utils/validation.util";

// Utils
import { setPageTitle } from "../../utils";

type TImage = { image: File | null };

const defaultState: TCategory & TImage = {
  id: null,
  label: null,
  priority: null,
  image: null,
};

type TErrors = {
  image: TValidation;
  label: TValidation;
  priority: TValidation;
};

const defaultErrorsState: TErrors = {
  image: {
    isValid: true,
  },
  label: {
    isValid: true,
  },
  priority: {
    isValid: true,
  },
};

const AdminCategory: FC = () => {
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const [formData, setFormData] = useState<TCategory & TImage>(defaultState);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [errors, setErrors] = useState<TErrors>(defaultErrorsState);
  const [isImageUpdated, setIsImageUpdated] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();

  const isEditMode: boolean = categoryId ? true : false;

  setPageTitle(isEditMode ? t("editCategory") : t("newCategory"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    if (isEditMode)
      await Promise.resolve(CATEGORY_API.get(categoryId as string)).then(
        (response: THTTPResponse) => {
          if (response && response.hasSuccess)
            setFormData({ ...response.data, image: response.data.id });
          else openPopup(t("unableLoadCategory"), "error");
        }
      );

    setIsLoading(false);
  }

  function onInputChange(propLabel: string, value: any): void {
    setFormData((prevState: any) => {
      return { ...prevState, [propLabel]: value };
    });
    setErrors((prevState: any) => {
      return { ...prevState, [propLabel]: { isValid: true, message: null } };
    });
  }

  function validateForm(): boolean {
    const isImageValid: TValidation = validateFormImage(
      formData.image as File,
      t
    );
    const isNameValid: TValidation = validateFormField(
      formData.label as string,
      t
    );

    const isFormValid: boolean = isImageValid.isValid && isNameValid.isValid;

    if (isFormValid) return true;
    else {
      setErrors((prevState: any) => ({
        ...prevState,
        image: {
          isValid: isImageValid.isValid,
          message: isImageValid.message,
        },
        name: {
          isValid: isNameValid.isValid,
          message: isNameValid.message,
        },
      }));

      return false;
    }
  }

  async function onSave(event?: FormEvent): Promise<void> {
    event?.preventDefault();

    const isFormValid: boolean = validateForm();

    if (!isFormValid) openPopup(t("invalidData"), "warning");
    else {
      setIsLoading(true);

      const data: Partial<TCategory> = {
        label: formData.label,
        priority: formData.priority,
      };

      if (isEditMode)
        await Promise.resolve(
          CATEGORY_API.update(data, categoryId as string)
        ).then(async (categoryRes: THTTPResponse) => {
          if (categoryRes && categoryRes.hasSuccess)
            if (isImageUpdated && formData.image)
              await Promise.resolve(IMAGES_API.delete(categoryRes.data)).then(
                async (deletedImageRes: THTTPResponse) => {
                  if (deletedImageRes && deletedImageRes.hasSuccess) {
                    await Promise.resolve(
                      IMAGES_API.add(
                        formData.id as string,
                        formData.image as File
                      )
                    ).then((imageRes: THTTPResponse) => {
                      if (imageRes && imageRes.hasSuccess)
                        openPopup(t("categorySuccessfullyUpdated"), "success");
                      else openPopup(t("unableUpdateImage"), "error");
                    });
                  } else openPopup(t("unableRemoveImage"), "error");
                }
              );
            else openPopup(t("categorySuccessfullyUpdated"), "success");
          else openPopup(t("unableUpdateCategory"), "error");
        });
      else
        await Promise.resolve(CATEGORY_API.create(data)).then(
          async (categoryRes: THTTPResponse) => {
            if (categoryRes && categoryRes.hasSuccess) {
              await Promise.resolve(
                IMAGES_API.add(categoryRes.data, formData.image as File)
              ).then((imageRes: THTTPResponse) => {
                if (imageRes && imageRes.hasSuccess) {
                  openPopup(t("categorySuccessfullyCreated"), "success");
                  navigate(`/admin/categories/edit/${categoryRes.data}`);
                } else openPopup(t("unableLoadImage"), "error");
              });
            } else openPopup(t("unableCreateCategory"), "error");
          }
        );

      await getData();

      setIsLoading(false);
    }
  }

  function onCancel(): void {
    setFormData(defaultState);
    setErrors(defaultErrorsState);
  }

  const breadcrumb: ReactNode = <Breadcrumb isDarkMode={isDarkMode} />;

  const buttons: ReactNode = (
    <div className="flex justify-end">
      <div className="flex gap-5 mobile:w-full mobile:justify-between">
        <Button onClick={onCancel} styleType="secondary">
          <div className="flex items-center gap-2">
            <ResetIcon className="text-primary" />
            <span className="text-primary">{t("cancel")}</span>
          </div>
        </Button>
        <Button onClick={onSave}>
          <div className="flex items-center gap-2">
            <SaveIcon className="text-white" />
            <span className="text-white">{t("save")}</span>
          </div>
        </Button>
      </div>
    </div>
  );

  const form: ReactNode = (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center justify-center mobile:flex-col">
          {formData.image && (
            <img
              id="image"
              src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/images/${formData.id}`}
              alt={t("imgNotFound")}
              className="w-60 rounded-lg object-contain"
            />
          )}
          <ImageSelector
            file={formData.image}
            onChange={(file: File) => {
              onInputChange("image", file);
              setIsImageUpdated(true);
            }}
            errorMessage={errors?.image?.message}
          />
          {isEditMode && !isImageUpdated ? (
            <span
              className={`transition-all duration-300 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              {t("changeImage")}
            </span>
          ) : (
            !formData.image && (
              <span
                className={`transition-all duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {t("selectImage")}
              </span>
            )
          )}
        </div>
        <form
          onSubmit={onSave}
          className="flex flex-row flex-wrap justify-center items-center gap-5"
        >
          <div className="w-[31.5%] mobile:w-full">
            <Input
              value={formData.label}
              onChange={(value: string) => onInputChange("label", value)}
              isDarkMode={isDarkMode}
              placeholder={t("name")}
              width="100%"
              errorMessage={errors?.label?.message}
            />
          </div>
          <div className="w-[31.5%] mobile:w-full">
            <Input
              type="number"
              value={formData.priority}
              onChange={(value: string) => onInputChange("priority", value)}
              isDarkMode={isDarkMode}
              placeholder={t("priority")}
              width="100%"
              errorMessage={errors?.priority?.message}
            />
          </div>
        </form>
      </div>
    </Card>
  );

  useEffect(() => {
    if (formData.image && typeof formData.image === "object") {
      let src: string = URL.createObjectURL(formData.image);
      let imagePreview: any = document.getElementById("image");
      if (imagePreview) imagePreview.src = src;
    }
  }, [formData.image]);

  useEffect(() => {
    getData();

    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <span className="text-primary text-2xl">{t("category")}</span>
      {breadcrumb}
      {buttons}
      {form}
    </div>
  );
};

export default AdminCategory;
