<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import EmptyGag from "../EmptyGag.vue";
import Label from "../ui/label/Label.vue";
import Button from "../ui/button/Button.vue";
import Input from "../ui/input/Input.vue";
import Textarea from "../ui/textarea/Textarea.vue";
import IngredientDialog from "./IngredientDialog.vue";
import { onBeforeUpdate, onMounted, onUpdated, ref } from "vue";

import { Trash, Pen, Plus } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

import axios from "axios";

const emit = defineEmits(["updateContent"]);
const props = defineProps({
  data: {
    type: Object,
    default(rawProps) {
      return {
        id: null,
        name: null,
        description: null,
        category: null,
        ingredients: [],
        status: null,
      };
    },
  },
  operationType: {
    type: String,
    required: true,
    default: "POST",
  },
});

const isDialogOpen = ref(false);

const recipeData = ref({
  id: null,
  name: null,
  description: null,
  category: null,
  ingredients: [],
  status: null,
});

function addIngredient(e) {
  recipeData.value.ingredients.push(e);
}

function removeIngredient(inameToRemove) {
  recipeData.value.ingredients = recipeData.value.ingredients.filter(
    (i) => i.name !== inameToRemove
  );
}

async function saveRecipe() {
  // Проверяем, что поля не пустые
  if (!recipeData.value.name) {
    toast({
      title: "Ошибка",
      description: "Укажите имя рецепта",
      variant: "destructive",
    });
    return;
  } else if (!recipeData.value.category) {
    toast({
      title: "Ошибка",
      description: "Укажите категорию рецепта",
      variant: "destructive",
    });
    return;
  } else if (recipeData.value.ingredients.length <= 0) {
    toast({
      title: "Ошибка",
      description: "Добавьте ингредиенты в рецепт",
      variant: "destructive",
    });
    return;
  }

  await axios
    .post(
      "http://localhost:3000/recipe?ulogin=" + localStorage.getItem("ulogin"),
      recipeData.value
    )
    .then((response) => {
      toast({
        title: "Рецепт успешно добавлен",
      });
      emit("updateContent");
      isDialogOpen.value = false;
      clearFields();
    })
    .catch((err) => {
      toast({
        title: "Ошибка",
        description: err.response.data.message,
        variant: "destructive",
      });
    });
}

async function updateRecipe() {
  // Проверяем, что поля не пустые
  if (!recipeData.value.name) {
    toast({
      title: "Ошибка",
      description: "Укажите имя рецепта",
      variant: "destructive",
    });
    return;
  } else if (!recipeData.value.category) {
    toast({
      title: "Ошибка",
      description: "Укажите категорию рецепта",
      variant: "destructive",
    });
    return;
  } else if (recipeData.value.ingredients.length <= 0) {
    toast({
      title: "Ошибка",
      description: "Добавьте ингредиенты в рецепт",
      variant: "destructive",
    });
    return;
  }

  await axios
    .patch(
      "http://localhost:3000/recipe?rid=" +
        recipeData.value.id +
        "&rlogin=" +
        localStorage.getItem("ulogin"),
      recipeData.value
    )
    .then((response) => {
      toast({
        title: "Рецепт успешно обновлён",
      });
      emit("updateContent");
      isDialogOpen.value = false;
      clearFields();
    })
    .catch((err) => {
      toast({
        title: "Ошибка",
        description: err.response.data.message,
        variant: "destructive",
      });
    });
}

function clearFields() {
  recipeData.value = {
    id: null,
    name: null,
    description: null,
    category: null,
    ingredients: [],
    status: null,
  };
}

async function toModeration() {
  await axios
    .patch(
      "http://localhost:3000/recipe/moderation?rid=" +
        recipeData.value.id +
        "&rlogin=" +
        localStorage.getItem("ulogin")
    )
    .then((result) => {
      toast({
        title: result.data.message,
      });
      updateRecipe();
    })
    .catch((err) => {
      toast({
        title: "Ошибка",
        description: err.response.data.message,
        variant: "destructive",
      });
    });
}

onUpdated(async () => {
  await axios
    .get(
      "http://localhost:3000/recipe?rid=" +
        props.data.recipe_id +
        "&rlogin=" +
        localStorage.getItem("ulogin")
    )
    .then((response) => {
      recipeData.value = response.data;
    });
});
</script>

<template>
  <Dialog v-model:open="isDialogOpen" class="w-full">
    <DialogTrigger>
      <slot></slot>
    </DialogTrigger>
    <DialogContent
      class="min-w-[33%] max-w-[50%] max-h-[75%] overflow-y-scroll gap-8"
    >
      <DialogHeader>
        <DialogTitle>Редактирование рецепта</DialogTitle>
      </DialogHeader>
      <div class="flex w-full justify-between gap-4">
        <div class="flex flex-col gap-2 w-full">
          <Label for="recipeName">Название рецепта</Label>
          <Input
            v-model:model-value="recipeData.name"
            id="recipeName"
            placeholder="Введите название..."
            maxlength="120"
          ></Input>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <Label for="recipeCategory">Категория</Label>
          <Select v-model:model-value="recipeData.category" id="recipeCategory">
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Категории</SelectLabel>
                <SelectItem value="Мясное"> Мясное </SelectItem>
                <SelectItem value="Рыбное"> Рыбное </SelectItem>
                <SelectItem value="Вегетарианское"> Вегетарианское </SelectItem>
                <SelectItem value="Закуска"> Закуска </SelectItem>
                <SelectItem value="Десерт"> Десерт </SelectItem>
                <SelectItem value="Праздничные"> Праздничные </SelectItem>
                <SelectItem value="Основные блюда"> Основные блюда </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <div class="flex gap-4 items-center">
          <h3>Ингредиенты</h3>
          <IngredientDialog @ingredient-set="(e) => addIngredient(e)"
            ><Button size="icon"><Plus class="w-4 h-4" /></Button
          ></IngredientDialog>
        </div>
        <Table v-if="recipeData.ingredients.length > 0">
          <TableHeader>
            <TableRow>
              <TableHead> Ингредиент </TableHead>
              <TableHead>Количество</TableHead>
              <TableHead>Мера</TableHead>
              <TableHead class="text-right">Операции</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="ingredient in recipeData.ingredients"
              :key="ingredient.name"
            >
              <TableCell class="font-medium">
                {{ ingredient.name }}
              </TableCell>
              <TableCell>{{ ingredient.amount }}</TableCell>
              <TableCell>{{ ingredient.measurement }}</TableCell>
              <TableCell class="flex gap-2 justify-end">
                <Button
                  @click="() => removeIngredient(ingredient.name)"
                  class="rounded-full"
                  size="sm"
                  variant="secondary"
                  ><Trash class="w-4 h-4"
                /></Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <EmptyGag v-else></EmptyGag>
      </div>
      <div class="flex flex-col gap-4">
        <h3>Описание</h3>
        <Textarea
          v-model:model-value="recipeData.description"
          class="min-h-[150px]"
        ></Textarea>
      </div>

      <DialogFooter class="items-center">
        <Button
          v-if="
            recipeData.status == 'private' && props.operationType == 'PATCH'
          "
          variant="outline"
          @click="toModeration"
          >На модерацию</Button
        >
        <p
          v-else-if="
            recipeData.status == 'onModeration' &&
            props.operationType == 'PATCH'
          "
          class="small"
        >
          На модерации
        </p>
        <Button v-if="props.operationType == 'POST'" @click="saveRecipe"
          >Сохранить</Button
        >
        <Button v-else @click="updateRecipe">Обновить</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
