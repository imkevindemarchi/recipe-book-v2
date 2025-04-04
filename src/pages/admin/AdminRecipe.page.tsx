import React, {
  FC,
  FormEvent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

// Api
import {
  CATEGORY_API,
  IMAGES_API,
  INGREDIENT_API,
  RECIPE_API,
} from "../../api";

// Components
import {
  Autocomplete,
  Breadcrumb,
  Button,
  Card,
  IconButton,
  ImageSelector,
  Input,
  Textarea,
} from "../../components";

// Contexts
import { ThemeContext, TThemeContext } from "../../providers/theme.provider";
import { LoaderContext, TLoaderContext } from "../../providers/loader.provider";
import { PopupContext, TPopupContext } from "../../providers/popup.provider";

// Icons
import {
  AddIcon,
  DeleteIcon,
  DragIcon,
  ResetIcon,
  SaveIcon,
} from "../../assets/icons";

// Types
import { TRecipe } from "../../types/recipe.type";
import { TIngredient, TRecipeIngredient } from "../../types/ingredient.type";
import { TCategory } from "../../types/category.type";
import { THTTPResponse } from "../../types";
import {
  TValidation,
  validateFormField,
  validateFormImage,
} from "../../utils/validation.util";
import { TAutocompleteValue } from "../../components/Autocomplete.component";

// Utils
import { setPageTitle } from "../../utils";

type TImage = { image: File | null };

const defaultState: TRecipe & TImage = {
  id: null,
  name: null,
  createDate: null,
  isFavourite: null,
  people: null,
  time: null,
  image: null,
  category: null,
  procedure: null,
  ingredients: null,
};

type TErrors = {
  image: TValidation;
  name: TValidation;
};

const defaultErrorsState: TErrors = {
  image: {
    isValid: true,
  },
  name: {
    isValid: true,
  },
};

type TStepErrors = {
  step: TValidation;
};

const defaultStepsErrorsState: TStepErrors = {
  step: {
    isValid: true,
  },
};

type TIngredientErrors = {
  ingredient: TValidation;
  quantity: TValidation;
};

const defaultIngredientsErrorsState: TIngredientErrors = {
  ingredient: {
    isValid: true,
  },
  quantity: {
    isValid: true,
  },
};

const ingredientsDefaultState: TRecipeIngredient = {
  id: null,
  label: null,
  quantity: null,
  icon: null,
};

const AdminRecipe: FC = () => {
  const { isDarkMode }: TThemeContext = useContext(
    ThemeContext
  ) as TThemeContext;
  const { t } = useTranslation();
  const { recipeId } = useParams();
  const [formData, setFormData] = useState<TRecipe & TImage>(defaultState);
  const { setState: setIsLoading }: TLoaderContext = useContext(
    LoaderContext
  ) as TLoaderContext;
  const { onOpen: openPopup }: TPopupContext = useContext(
    PopupContext
  ) as TPopupContext;
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [errors, setErrors] = useState<TErrors>(defaultErrorsState);
  const [isImageUpdated, setIsImageUpdated] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const [step, setStep] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<TStepErrors>(
    defaultStepsErrorsState
  );
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [ingredientsFormData, setIngredientsFormData] =
    useState<TRecipeIngredient>(ingredientsDefaultState);
  const [ingredientsErrors, setIngredientsErrors] = useState<TIngredientErrors>(
    defaultIngredientsErrorsState
  );
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const { pathname } = useLocation();

  const isEditMode: boolean = recipeId ? true : false;

  setPageTitle(isEditMode ? t("editRecipe") : t("newRecipe"));

  async function getData(): Promise<void> {
    setIsLoading(true);

    await Promise.resolve(CATEGORY_API.getAll()).then(
      (response: THTTPResponse) => {
        if (response && response.hasSuccess) setCategories(response.data);
        else openPopup(t("unableLoadCategories"), "error");
      }
    );

    if (isEditMode)
      await Promise.all([
        RECIPE_API.get(recipeId as string),
        INGREDIENT_API.getAll(),
      ]).then((response: THTTPResponse[]) => {
        if (response[0] && response[0].hasSuccess)
          setFormData({ ...response[0].data, image: response[0].data.id });
        else openPopup(t("unableLoadRecipe"), "error");

        if (response[1] && response[1].hasSuccess)
          setIngredients(response[1].data);
        else openPopup(t("unableLoadIngredients"), "error");
      });

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

  function onIngredientsInputChange(propLabel: string, value: any): void {
    setIngredientsFormData((prevState: any) => {
      return { ...prevState, [propLabel]: value };
    });
    setIngredientsErrors((prevState: any) => {
      return { ...prevState, [propLabel]: { isValid: true, message: null } };
    });
  }

  function validateForm(): boolean {
    const isImageValid: TValidation = validateFormImage(
      formData.image as File,
      t
    );
    const isNameValid: TValidation = validateFormField(
      formData.name as string,
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

      const data: Partial<TRecipe> = {
        name: formData.name,
        category: formData.category,
        createDate: new Date(),
        isFavourite: false,
        people: formData.people,
        time: formData.time,
        procedure: formData.procedure,
        ingredients: formData.ingredients,
      };

      if (isEditMode)
        await Promise.resolve(RECIPE_API.update(data, recipeId as string)).then(
          async (recipeRes: THTTPResponse) => {
            if (recipeRes && recipeRes.hasSuccess)
              if (isImageUpdated && formData.image)
                await Promise.resolve(IMAGES_API.delete(recipeRes.data)).then(
                  async (deletedImageRes: THTTPResponse) => {
                    if (deletedImageRes && deletedImageRes.hasSuccess) {
                      await Promise.resolve(
                        IMAGES_API.add(
                          formData.id as string,
                          formData.image as File
                        )
                      ).then((imageRes: THTTPResponse) => {
                        if (imageRes && imageRes.hasSuccess)
                          openPopup(t("recipeSuccessfullyUpdated"), "success");
                        else openPopup(t("unableUpdateImage"), "error");
                      });
                    } else openPopup(t("unableRemoveImage"), "error");
                  }
                );
              else openPopup(t("recipeSuccessfullyUpdated"), "success");
            else openPopup(t("unableUpdateRecipe"), "error");
          }
        );
      else
        await Promise.resolve(RECIPE_API.create(data)).then(
          async (recipeRes: THTTPResponse) => {
            if (recipeRes && recipeRes.hasSuccess) {
              await Promise.resolve(
                IMAGES_API.add(recipeRes.data, formData.image as File)
              ).then((imageRes: THTTPResponse) => {
                if (imageRes && imageRes.hasSuccess) {
                  openPopup(t("recipeSuccessfullyCreated"), "success");
                  navigate(`/admin/recipes/edit/${recipeRes.data}`);
                } else openPopup(t("unableLoadImage"), "error");
              });
            } else openPopup(t("unableCreateRecipe"), "error");
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

  function validateStepForm(): boolean {
    const isStepValid: TValidation = validateFormField(step as string, t);

    const isFormValid: boolean = isStepValid.isValid;

    if (isFormValid) return true;
    else {
      setStepErrors((prevState: any) => ({
        ...prevState,
        step: {
          isValid: isStepValid.isValid,
          message: isStepValid.message,
        },
      }));

      return false;
    }
  }

  function onAddStep(event: FormEvent): void {
    event.preventDefault();

    const isFormValid: boolean = validateStepForm();

    if (!isFormValid) openPopup(t("invalidData"), "warning");
    else {
      const procedure: string[] = formData.procedure
        ? [...formData.procedure]
        : [];
      procedure.push(step as string);

      onInputChange("procedure", procedure);
      setStep(null);
    }
  }

  function onDragStart(index: number): void {
    setDraggedIndex(index);
  }

  function onDragOver(event: any): void {
    event.preventDefault();
  }

  function onDragDrop(index: number): void {
    if (draggedIndex === null) return;

    const procedure: string[] = formData.procedure as string[];
    const [movedItem] = procedure.splice(draggedIndex, 1);
    procedure.splice(index, 0, movedItem);

    onInputChange("procedure", procedure);
    setDraggedIndex(null);
  }

  function validateIngredientsForm(): boolean {
    const isIngredientValid: TValidation = validateFormField(
      ingredientsFormData?.label as string,
      t
    );
    const isQuantityValid: TValidation = validateFormField(
      (ingredientsFormData?.quantity as string)?.toString(),
      t
    );

    const isFormValid: boolean =
      isIngredientValid.isValid && isQuantityValid.isValid;

    if (isFormValid) return true;
    else {
      setIngredientsErrors((prevState: any) => ({
        ...prevState,
        ingredient: {
          isValid: isIngredientValid.isValid,
          message: isIngredientValid.message,
        },
        quantity: {
          isValid: isQuantityValid.isValid,
          message: isQuantityValid.message,
        },
      }));

      return false;
    }
  }

  function onAddIngredient(event: FormEvent): void {
    event.preventDefault();

    const isFormValid: boolean = validateIngredientsForm();

    if (!isFormValid) openPopup(t("invalidData"), "warning");
    else {
      const ingredients: TRecipeIngredient[] = formData.ingredients
        ? [...formData.ingredients]
        : [];
      ingredients.push({
        id: ingredientsFormData?.id as string,
        label: ingredientsFormData?.label as string,
        quantity: ingredientsFormData?.quantity as string,
        icon: ingredientsFormData.icon,
      });

      onInputChange("ingredients", ingredients);
      setIngredientsFormData(ingredientsDefaultState);
    }
  }

  function onDeleteIngredient(ingredient: TRecipeIngredient): void {
    const ingredients: TRecipeIngredient[] = [...(formData.ingredients || [])];

    const elabIngredients: TRecipeIngredient[] = ingredients.filter(
      (item: TRecipeIngredient) => item.id !== ingredient.id
    );

    onInputChange("ingredients", elabIngredients);
  }

  function onDeleteStep(step: string): void {
    const procedure: string[] = [...(formData.procedure || [])];

    const elabProcedure: string[] = procedure.filter(
      (item: string) => item !== step
    );

    onInputChange("procedure", elabProcedure);
  }

  const title = (title: string): ReactNode => (
    <span className="text-primary text-2xl">{title}</span>
  );

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
        <div className="flex gap-2 items-center mobile:flex-col">
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
          className="flex flex-row flex-wrap justify-between gap-5"
        >
          <div className="w-[31.5%] mobile:w-full">
            <Input
              value={formData.name}
              onChange={(value: string) => onInputChange("name", value)}
              isDarkMode={isDarkMode}
              placeholder={t("name")}
              width="100%"
              errorMessage={errors?.name?.message}
            />
          </div>
          <div className="w-[31.5%] mobile:w-full">
            <Autocomplete
              value={formData.category as TCategory}
              onChange={(value: Partial<TCategory>) =>
                onInputChange("category", value)
              }
              isDarkMode={isDarkMode}
              placeholder={t("category")}
              data={categories}
              width="100%"
            />
          </div>
          <div className="w-[31.5%] mobile:w-full">
            <Input
              value={formData.time}
              onChange={(value: string) => onInputChange("time", value)}
              isDarkMode={isDarkMode}
              placeholder={t("time")}
              width="100%"
            />
          </div>
          <div className="w-[31.5%] mobile:w-full">
            <Input
              type="number"
              value={formData.people}
              onChange={(value: string) => onInputChange("people", value)}
              isDarkMode={isDarkMode}
              placeholder={t("people")}
              width="100%"
            />
          </div>
        </form>
      </div>
    </Card>
  );

  const ingredientsForm: ReactNode = (
    <Card isDarkMode={isDarkMode}>
      <form
        onSubmit={onAddIngredient}
        className="flex items-center gap-5 mobile:flex-col"
      >
        <div className="w-[31.5%] mobile:w-full">
          <Autocomplete
            value={
              {
                id: ingredientsFormData?.id,
                label: ingredientsFormData?.label,
              } as TAutocompleteValue
            }
            onChange={(value: Partial<TIngredient>) => {
              onIngredientsInputChange("id", value.id);
              onIngredientsInputChange("label", value.label);
              onIngredientsInputChange("icon", value.icon);
            }}
            isDarkMode={isDarkMode}
            placeholder={t("ingredient")}
            data={ingredients}
            width="100%"
            errorMessage={ingredientsErrors?.ingredient?.message}
          />
        </div>
        <div className="w-[31.5%] mobile:w-full">
          <Input
            value={ingredientsFormData?.quantity as string}
            onChange={(value: string) =>
              onIngredientsInputChange("quantity", value)
            }
            isDarkMode={isDarkMode}
            placeholder={t("quantity")}
            width="100%"
            errorMessage={ingredientsErrors?.quantity?.message}
          />
        </div>
        <Button type="submit" styleType="round">
          <AddIcon className="text-white text-2xl" />
        </Button>
      </form>
    </Card>
  );

  const ingredientsList: ReactNode = (
    <div className="flex flex-col gap-5">
      {formData.ingredients?.map(
        (ingredient: TRecipeIngredient, index: number) => {
          return (
            <div
              key={index}
              className="bg-primary-transparent py-2 px-5 rounded-xl flex justify-between items-center"
            >
              <span
                className={`transition-all duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {`${ingredient.quantity} - ${ingredient.label} ${ingredient.icon}`}
              </span>
              <IconButton onClick={() => onDeleteIngredient(ingredient)} small>
                <DeleteIcon className="text-primary text-xl" />
              </IconButton>
            </div>
          );
        }
      )}
    </div>
  );

  const ingredientsNoData: ReactNode = (
    <span
      className={`transition-all duration-300 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      {t("noRegisteredIngredients")}
    </span>
  );

  const ingredientsComponent: ReactNode = (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-5">
        {formData.ingredients && formData.ingredients.length > 0
          ? ingredientsList
          : ingredientsNoData}
      </div>
    </Card>
  );

  const procedureForm: ReactNode = (
    <Card isDarkMode={isDarkMode}>
      <form
        onSubmit={onAddStep}
        className="flex flex-row flex-wrap gap-5 justify-around"
      >
        <div className="w-full">
          <Textarea
            value={step as string}
            onChange={(value: string) => setStep(value)}
            isDarkMode={isDarkMode}
            placeholder={t("step")}
            width="100%"
            errorMessage={stepErrors?.step?.message}
          />
        </div>
        <Button type="submit" styleType="round">
          <AddIcon className="text-white text-2xl" />
        </Button>
      </form>
    </Card>
  );

  const procedureList: ReactNode = (
    <div className="flex flex-col gap-5">
      {formData.procedure?.map((step: string, index: number) => {
        return (
          <div
            key={index}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={onDragOver}
            onDrop={() => onDragDrop(index)}
            className="bg-primary-transparent py-2 px-5 rounded-xl flex items-center cursor-pointer justify-between gap-5"
          >
            <div className="flex items-center gap-5">
              <DragIcon
                color={process.env.REACT_APP_PRIMARY_COLOR}
                className="text-xl mobile:hidden"
              />
              <span
                className={`transition-all duration-300 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                {step}
              </span>
            </div>
            <IconButton onClick={() => onDeleteStep(step)} small>
              <DeleteIcon className="text-primary text-xl" />
            </IconButton>
          </div>
        );
      })}
    </div>
  );

  const procedureNoData: ReactNode = (
    <span
      className={`transition-all duration-300 ${
        isDarkMode ? "text-white" : "text-black"
      }`}
    >
      {t("noRegisteredSteps")}
    </span>
  );

  const procedureComponent: ReactNode = (
    <Card isDarkMode={isDarkMode}>
      <div className="flex flex-col gap-5">
        {formData.procedure && formData.procedure.length > 0
          ? procedureList
          : procedureNoData}
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
  }, [pathname]);

  return (
    <div className="w-full h-full flex flex-col gap-5">
      {title(t("recipe"))}
      {breadcrumb}
      {buttons}
      {form}
      {isEditMode && (
        <>
          {title(t("ingredients"))}
          {ingredientsForm}
          {ingredientsComponent}
          {title(t("procedure"))}
          {procedureForm}
          {procedureComponent}
        </>
      )}
    </div>
  );
};

export default AdminRecipe;
