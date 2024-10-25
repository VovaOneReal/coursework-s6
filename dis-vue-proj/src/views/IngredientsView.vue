<script setup lang="ts">
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import Button from "@/components/ui/button/Button.vue";
import { onMounted, ref } from "vue";

import { Trash } from "lucide-vue-next";

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
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";

import axios from "axios";
import html2pdf from "html2pdf.js";

import Toaster from "@/components/ui/toast/Toaster.vue";
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

async function addIngredient() {
  // Проверяем заполненность параметров
  if (!ingredientData.value.name) {
    toast({
      title: "Ошибка",
      description: "Заполните название ингредиента",
      variant: "destructive",
    });
  }

  await axios
    .post(
      "http://localhost:3000/ingredient?rlogin=" +
        localStorage.getItem("ulogin"),
      ingredientData.value
    )
    .then((result) => {
      toast({
        title: result.data.message,
      });
      getIngredientsList();
    })
    .catch((err) => {
      toast({
        title: "Ошибка",
        description: err.response.data.message,
        variant: "destructive",
      });
    });
}

async function deleteIngredient(iname) {
  await axios
    .delete(
      "http://localhost:3000/ingredient?iname=" +
        iname +
        "&rlogin=" +
        localStorage.getItem("ulogin")
    )
    .then((result) => {
      toast({
        title: result.data.message,
      });
      getIngredientsList();
    })
    .catch((err) => {
      toast({
        title: "Ошибка",
        description: err.response.data.message,
        variant: "destructive",
      });
    });
}

const ingredientsList = ref([]);

const ingredientData = ref({
  name: null,
  fats: 0,
  proteins: 0,
  carbo: 0,
  calories: 0,
});

async function getIngredientsList() {
  await axios.get("http://localhost:3000/ingredient").then((res) => {
    ingredientsList.value = res.data;
  });
}

onMounted(async () => {
  await getIngredientsList();
});

async function goHome() {
  await router.push("/user/" + localStorage.getItem("ulogin"));
}

function formPDF() {
  var report = document.createElement("div");
  var reportHeader = document.getElementById("report-header").cloneNode(true);
  var reportBody = document.getElementById("report").cloneNode(true);
  report.appendChild(reportHeader).appendChild(reportBody);
  html2pdf(report);
}
</script>

<template>
  <Toaster />
  <div class="p-8 flex flex-col gap-8 min-h-screen">
    <div class="flex gap-4">
      <h2 id="report-header">Ингредиенты</h2>
      <Button @click="goHome">Назад</Button>
      <Button @click="formPDF">Скачать PDF</Button>
    </div>

    <div class="flex gap-4 items-end">
      <div class="flex flex-col gap-2">
        <Label for="name"> Название </Label>
        <Input
          v-model:model-value="ingredientData.name"
          id="name"
          placeholder="Введите значение..."
        ></Input>
      </div>
      <div class="flex flex-col gap-2">
        <NumberField
          id="fats"
          v-model:model-value="ingredientData.fats"
          :default-value="0"
          :min="0"
          :step="0.1"
          :format-options="{
            minimumFractionDigits: 1,
          }"
        >
          <Label for="fats"> Жиры </Label>
          <NumberFieldContent>
            <NumberFieldInput />
          </NumberFieldContent>
        </NumberField>
      </div>
      <div class="flex flex-col gap-2">
        <NumberField
          id="proteins"
          v-model:model-value="ingredientData.proteins"
          :default-value="0"
          :min="0"
          :step="0.1"
          :format-options="{
            minimumFractionDigits: 1,
          }"
        >
          <Label for="proteins"> Протеины </Label>
          <NumberFieldContent>
            <NumberFieldInput />
          </NumberFieldContent>
        </NumberField>
      </div>
      <div class="flex flex-col gap-2">
        <NumberField
          id="carbo"
          v-model:model-value="ingredientData.carbo"
          :default-value="0"
          :min="0"
          :step="0.1"
          :format-options="{
            minimumFractionDigits: 1,
          }"
        >
          <Label for="carbo"> Углеводы </Label>
          <NumberFieldContent>
            <NumberFieldInput />
          </NumberFieldContent>
        </NumberField>
      </div>
      <div class="flex flex-col gap-2">
        <NumberField
          id="calories"
          v-model:model-value="ingredientData.calories"
          :default-value="0"
          :min="0"
        >
          <Label for="calories"> Калории </Label>
          <NumberFieldContent>
            <NumberFieldInput />
          </NumberFieldContent>
        </NumberField>
      </div>
      <Button @click="addIngredient">Добавить</Button>
    </div>

    <Table id="report">
      <TableHeader>
        <TableRow>
          <TableHead>Ингредиент</TableHead>
          <TableHead>Белки</TableHead>
          <TableHead>Жиры</TableHead>
          <TableHead>Углеводы</TableHead>
          <TableHead>Калории</TableHead>
          <TableHead>Создатель</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="ingredient in ingredientsList"
          :key="ingredient.ingredient_name"
        >
          <TableCell class="font-medium">
            {{ ingredient.ingredient_name }}
          </TableCell>
          <TableCell>{{ ingredient.ingredient_proteins }}</TableCell>
          <TableCell>{{ ingredient.ingredient_fats }}</TableCell>
          <TableCell>{{ ingredient.ingredient_proteins }}</TableCell>
          <TableCell>{{ ingredient.ingredient_calories }}</TableCell>
          <TableCell>{{
            ingredient.creator_login ? ingredient.creator_login : "Неизвестно"
          }}</TableCell>
          <TableCell
            ><Button
              @click="() => deleteIngredient(ingredient.ingredient_name)"
              class="rounded-full"
              size="sm"
              variant="secondary"
              ><Trash class="w-4 h-4" /></Button
          ></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
