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

import EmptyGag from "../EmptyGag.vue";
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
        <DialogTitle>{{ recipeData.name }}</DialogTitle>
        <DialogDescription>{{ recipeData.category }}</DialogDescription>
      </DialogHeader>
      <div>
        <div class="flex gap-4 items-center">
          <h3>Ингредиенты</h3>
        </div>
        <Table v-if="recipeData.ingredients.length > 0">
          <TableCaption>КБЖУ указаны для 100 гр. продуктов</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Ингредиент</TableHead>
              <TableHead>Белки</TableHead>
              <TableHead>Жиры</TableHead>
              <TableHead>Углеводы</TableHead>
              <TableHead>Калории</TableHead>
              <TableHead>Количество</TableHead>
              <TableHead>Мера</TableHead>
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
              <TableCell>{{ ingredient.proteins }}</TableCell>
              <TableCell>{{ ingredient.fats }}</TableCell>
              <TableCell>{{ ingredient.proteins }}</TableCell>
              <TableCell>{{ ingredient.calories }}</TableCell>
              <TableCell class="font-medium">{{ ingredient.amount }}</TableCell>
              <TableCell class="font-medium">{{
                ingredient.measurement
              }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <EmptyGag v-else></EmptyGag>
      </div>
      <div class="flex flex-col gap-4">
        <h3>Описание</h3>
        <p class="w-full">{{ recipeData.description }}</p>
      </div>

      <DialogFooter class="items-center">
        <p v-if="recipeData.status == 'onModeration'" class="small">
          На модерации
        </p>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
