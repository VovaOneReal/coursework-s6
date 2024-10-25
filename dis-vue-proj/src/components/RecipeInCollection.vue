<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Eye,
  FileSearch,
  Lock,
  SquareArrowOutUpRight,
  Tag,
  Trash,
  Calendar,
  SquareMinus,
} from "lucide-vue-next";

import TooltipWrap from "./TooltipWrap.vue";
import RecipeDropdown from "./RecipeDropdown.vue";
import ViewRecipeDialog from "./dialogs/ViewRecipeDialog.vue";

const props = defineProps(["data"]);
const emit = defineEmits(["updateContent", "unlinkRecipe"]);

function unlinkRecipe() {
  emit("unlinkRecipe", props.data.recipe_id);
}
</script>

<template>
  <Card>
    <CardHeader class="gap-4">
      <CardTitle class="flex justify-between items-center">
        <ViewRecipeDialog :data="props.data">
          <div class="clickable">
            {{ data.recipe_name }}
          </div>
        </ViewRecipeDialog>
        <div class="self-start">
          <Button @click="unlinkRecipe"><SquareMinus /></Button>
        </div>
      </CardTitle>
      <CardDescription class="flex gap-2 justify-between">
        <div class="flex gap-2">
          <div class="flex gap-1"><Tag /> {{ data.recipe_category }}</div>
          <div class="flex gap-1">
            <Calendar /> {{ data.recipe_creation_date.split("T")[0] }}
          </div>
        </div>
        <TooltipWrap v-if="data.recipe_status == 'public'" text="Виден всем">
          <div class="flex gap-1">
            <Eye />
          </div>
        </TooltipWrap>
        <TooltipWrap
          text="На модерации"
          v-else-if="data.recipe_status == 'onModeration'"
        >
          <div class="flex gap-1">
            <FileSearch />
          </div>
        </TooltipWrap>
        <TooltipWrap
          v-else-if="data.recipe_status == 'private'"
          text="Виден только вам"
        >
          <div class="flex gap-1">
            <Lock />
          </div>
        </TooltipWrap>
      </CardDescription>
    </CardHeader>
  </Card>
</template>
