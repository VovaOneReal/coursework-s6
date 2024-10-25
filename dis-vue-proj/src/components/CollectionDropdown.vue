<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "./ui/button/Button.vue";
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();
import { EllipsisVertical, Trash, Pen, Star } from "lucide-vue-next";

import axios from "axios";
import { ref } from "vue";

const props = defineProps(["data"]);
const emit = defineEmits(["updateContent"]);

const userCollections = ref([]);

async function addCollection(cid) {
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

async function deleteCollection() {
  await axios
    .delete(
      "http://localhost:3000/collection?cid=" +
        props.data.collection_id +
        "&rlogin=" +
        localStorage.getItem("ulogin")
    )
    .then((response) => {
      toast({
        title: "Коллекция успешно удалена",
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
</script>

<template>
  <!-- TODO добавить редактирование названия и статуса -->
  <DropdownMenu>
    <DropdownMenuTrigger
      ><Button variant="outline" size="icon"><EllipsisVertical /></Button
    ></DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Действия с коллекцией</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <!-- <DropdownMenuItem class="gap-2 w-full"
        ><Star :size="16" /> Добавить коллекцию к себе</DropdownMenuItem
      > -->
      <DropdownMenuItem
        @click="deleteCollection"
        class="text-destructive gap-2 w-full"
      >
        <Trash :size="16" />Удалить</DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
</template>
