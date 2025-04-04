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
import { INGREDIENT_API } from "../../api";

// Components
import { Breadcrumb, Button, Card, Input } from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/popup.provider";

// Icons
import { ResetIcon, SaveIcon } from "../../assets/icons";

// Types
import { TIngredient } from "../../types/ingredient.type";
import { THTTPResponse } from "../../types";
import { TValidation, validateFormField } from "../../utils/validation.util";

// Utils
import { setPageTitle } from "../../utils";

type TImage = { image: File | null };

const defaultState: TIngredient & TImage = {
  id: null,
  label: null,
  icon: null,
  image: null,
};

type TErrors = {
  image: TValidation;
  label: TValidation;
  icon: TValidation;
};

const defaultErrorsState: TErrors = {
  image: {
    isValid: true,
  },
  label: {
    isValid: true,
  },
  icon: {
    isValid: true,
  },
};

const AdminIngredient: FC = () => {
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { t } = useTranslation();
  const { ingredientId } = useParams();
  const [formData, setFormData] = useState<TIngredient & TImage>(defaultState);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [errors, setErrors] = useState<TErrors>(defaultErrorsState);
  const navigate: NavigateFunction = useNavigate();
  const [ingredients, setIngredients] = useState<TIngredient[] | null>(null);

  const isEditMode: boolean = ingredientId ? true : false;

  setPageTitle(isEditMode ? t("editIngredient") : t("newIngredient"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(INGREDIENT_API.getAll()).then(
      (response: THTTPResponse) => {
        if (response && response.hasSuccess) setIngredients(response.data);
        else openPopup(t("unableLoadIngredients"), "error");
      }
    );

    if (isEditMode)
      await Promise.resolve(INGREDIENT_API.get(ingredientId as string)).then(
        (response: THTTPResponse) => {
          if (response && response.hasSuccess)
            setFormData({ ...response.data, image: response.data.id });
          else openPopup(t("unableLoadIngredient"), "error");
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
    const isLabelValid: TValidation = validateFormField(
      formData.label as string,
      t
    );
    const isIconValid: TValidation = validateFormField(
      formData.icon as string,
      t
    );

    const isFormValid: boolean = isLabelValid.isValid && isIconValid.isValid;

    if (isFormValid) return true;
    else {
      setErrors((prevState: any) => ({
        ...prevState,
        label: {
          isValid: isLabelValid.isValid,
          message: isLabelValid.message,
        },
        icon: {
          isValid: isIconValid.isValid,
          message: isIconValid.message,
        },
      }));

      return false;
    }
  }

  async function onSave(event?: FormEvent): Promise<void> {
    event?.preventDefault();

    const isFormValid: boolean = validateForm();
    const ingredientAlreadyExists: boolean = ingredients?.find(
      (ingredient: TIngredient) =>
        ingredient.label?.toLowerCase().trim() ===
        formData.label?.toLowerCase().trim()
    )
      ? true
      : false;

    if (!isFormValid) openPopup(t("invalidData"), "warning");
    else if (ingredientAlreadyExists && !isEditMode)
      openPopup(t("ingredientAlreadyExists"), "warning");
    else {
      setIsLoading(true);

      const data: Partial<TIngredient> = {
        label: formData.label,
        icon: formData.icon,
      };

      if (isEditMode)
        await Promise.resolve(
          INGREDIENT_API.update(data, ingredientId as string)
        ).then(async (response: THTTPResponse) => {
          if (response && response.hasSuccess)
            openPopup(t("ingredientSuccessfullyUpdated"), "success");
          else openPopup(t("unableUpdateIngredient"), "error");
        });
      else
        await Promise.resolve(INGREDIENT_API.create(data)).then(
          async (response: THTTPResponse) => {
            if (response && response.hasSuccess) {
              openPopup(t("ingredientSuccessfullyCreated"), "success");
              navigate(`/admin/ingredients/edit/${response.data}`);
            } else openPopup(t("unableCreateIngredient"), "error");
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
              value={formData.icon}
              onChange={(value: string) => onInputChange("icon", value)}
              isDarkMode={isDarkMode}
              placeholder={t("icon")}
              width="100%"
              errorMessage={errors?.icon?.message}
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
      <span className="text-primary text-2xl">{t("ingredient")}</span>
      {breadcrumb}
      {buttons}
      {form}
    </div>
  );
};

export default AdminIngredient;
