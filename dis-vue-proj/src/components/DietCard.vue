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
  CalendarClock,
  Eye,
  FileSearch,
  Lock,
  SquareArrowOutUpRight,
  Tag,
  Trash,
} from "lucide-vue-next";
import { Calendar } from "lucide-vue-next";
import axios from "axios";

const props = defineProps(["data"]);
const emit = defineEmits(["updateContent"]);

// function deleteRecipe() {
//   axios.delete(
//     "http://localhost:3000/recipe?rid" +
//       props.data.recipe_id +
//       "&" +
//       localStorage.getItem("ulogin")
//   );
// }
</script>

<template>
  <Card>
    <CardHeader class="gap-4">
      <CardTitle class="flex justify-between items-center">
        {{ data.diet_name }}
        <div class="flex gap-4">
          <Button size="sm" variant="destructive">
            <Trash :size="16" />
          </Button>
          <Button size="sm"><SquareArrowOutUpRight :size="16" /></Button>
        </div>
      </CardTitle>

      <CardDescription class="flex gap-2">
        <div class="flex gap-1">
          <Calendar /> {{ data.diet_creation_date.split("T")[0] }}
        </div>
        <div class="flex gap-1">
          <CalendarClock /> {{ data.diet_date.split("T")[0] }}
        </div>
      </CardDescription>
    </CardHeader>
  </Card>
</template>
