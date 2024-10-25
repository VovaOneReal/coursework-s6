<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import Button from "./ui/button/Button.vue";
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();
import { EllipsisVertical, Trash, Pen, Star } from "lucide-vue-next";

import RecipeDialog from "./dialogs/RecipeDialog.vue";

import axios from "axios";
import { ref } from "vue";

const props = defineProps(["data"]);
const emit = defineEmits(["updateContent"]);

const userCollections = ref([]);

async function addToCollection(cid) {
  await axios
    .post(
      "http://localhost:3000/collection/addrecipe?cid=" +
        cid +
        "&rid=" +
        props.data.recipe_id +
        "&rlogin=" +
        localStorage.getItem("ulogin")
    )
    .then((result) => {
      toast({
        title: "Рецепт успешно добавлен в коллекцию",
      });
    })
    .catch((err) => {
      toast({
        title: "Ошибка",
        description: err.response.data.message,
        variant: "destructive",
      });
    });
}

async function deleteRecipe() {
  await axios
    .delete(
      "http://localhost:3000/recipe?rid=" +
        props.data.recipe_id +
        "&rlogin=" +
        localStorage.getItem("ulogin")
    )
    .then((response) => {
      toast({
        title: "Рецепт успешно удалён",
      });
      emit("updateContent");
    })
    .catch((err) => {
      toast({
        title: "Ошибка",
        description: err.response.data.message,
        variant: "destructive",
      });
    });
}

async function getUserCollections(e) {
  // Получаем список коллекций только когда открываем подменю
  if (e === true) {
    await axios
      .get(
        "http://localhost:3000/collections?ulogin=" +
          localStorage.getItem("ulogin") +
          "&rlogin=" +
          localStorage.getItem("ulogin")
      )
      .then((result) => {
        userCollections.value = result.data;
      })
      .catch((err) => {
        toast({
          title: "Ошибка",
          description: err.response.data.message,
          variant: "destructive",
        });
      });
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger
      ><Button variant="outline" size="icon"><EllipsisVertical /></Button
    ></DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Действия с рецептом</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuSub @update:open="(e) => getUserCollections(e)">
        <DropdownMenuSubTrigger class="w-full gap-2">
          <Star :size="16" /> Добавить в коллекцию
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent class="p-0">
          <DropdownMenuItem
            v-for="collection in userCollections"
            :key="collection.id"
            @click="() => addToCollection(collection.id)"
            class="gap-2 w-full"
          >
            {{ collection.name }}
          </DropdownMenuItem>
          <DropdownMenuItem v-if="userCollections.length <= 0"
            >Нет коллекций</DropdownMenuItem
          >
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <RecipeDialog
        @update-content="() => emit('updateContent')"
        operation-type="PATCH"
        :data="props.data"
      >
        <DropdownMenuItem @select.prevent class="gap-2 w-full"
          ><Pen :size="16" />Редактировать</DropdownMenuItem
        >
      </RecipeDialog>
      <DropdownMenuItem
        @click="deleteRecipe"
        class="text-destructive gap-2 w-full"
      >
        <Trash :size="16" /> Удалить</DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
</template>
