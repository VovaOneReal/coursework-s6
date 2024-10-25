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

import RecipeInCollection from "../RecipeInCollection.vue";
import EmptyGag from "../EmptyGag.vue";

import { ref, defineProps, onUpdated, onMounted } from "vue";

import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

import axios from "axios";

const emit = defineEmits(["updateContent"]);
const props = defineProps(["data"]);

const isDialogOpen = ref(false);

const collectionInfo = ref({});

async function updateRecipeList() {
  await axios
    .get(
      "http://localhost:3000/collection?cid=" +
        props.data.collection_id +
        "&rlogin=" +
        localStorage.getItem("ulogin")
    )
    .then((result) => {
      collectionInfo.value = result.data;
    });
}

async function recipeCardEdit() {
  await updateRecipeList();
  emit("updateContent");
}

async function unlinkRecipe(e) {
  await axios
    .delete(
      "http://localhost:3000/collection/recipe?cid=" +
        props.data.collection_id +
        "&rid=" +
        e +
        "&rlogin=" +
        localStorage.getItem("ulogin")
    )
    .then((res) => {
      toast({
        description: res.data.message,
      });
      updateRecipeList();
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
  await updateRecipeList();
});

onMounted(async () => {
  await updateRecipeList();
});
</script>

<template>
  <Dialog @update:open="updateRecipeList" class="w-full">
    <DialogTrigger>
      <slot></slot>
    </DialogTrigger>
    <DialogContent
      class="min-w-[15%] max-w-[50%] max-h-[75%] overflow-y-scroll gap-8"
    >
      <DialogHeader>
        <DialogTitle>{{ props.data.collection_name }}</DialogTitle>
        <DialogDescription>{{
          props.data.collection_status == "public" ? "Публичная" : "Приватная"
        }}</DialogDescription>
      </DialogHeader>
      <div class="flex flex-col w-full gap-4">
        <div
          v-if="collectionInfo.recipes.length > 0"
          class="grid grid-cols-2 gap-8"
        >
          <RecipeInCollection
            v-for="recipe in collectionInfo.recipes"
            :key="recipe.recipe_id"
            :data="recipe"
            @unlink-recipe="(e) => unlinkRecipe(e)"
            @update-content="recipeCardEdit"
          ></RecipeInCollection>
        </div>
        <EmptyGag v-else />
      </div>
    </DialogContent>
  </Dialog>
</template>
