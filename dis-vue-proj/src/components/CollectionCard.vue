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
import { Eye, Lock } from "lucide-vue-next";
import { Calendar } from "lucide-vue-next";
import TooltipWrap from "./TooltipWrap.vue";
import CollectionDropdown from "./CollectionDropdown.vue";
import ViewCollectionDialog from "./dialogs/ViewCollectionDialog.vue";
import axios from "axios";

const props = defineProps(["data"]);
const emit = defineEmits(["updateContent"]);
</script>

<template>
  <Card>
    <CardHeader class="gap-4">
      <CardTitle class="flex justify-between items-center">
        <ViewCollectionDialog
          @update-content="() => emit('updateContent')"
          :data="props.data"
        >
          <div class="clickable">
            {{ data.collection_name }}
          </div>
        </ViewCollectionDialog>
        <CollectionDropdown
          @update-content="() => emit('updateContent')"
          :data="props.data"
        ></CollectionDropdown>
      </CardTitle>
      <CardDescription class="flex gap-2 justify-between">
        <div class="flex gap-1">
          <Calendar /> {{ data.collection_creation_date.split("T")[0] }}
        </div>
        <TooltipWrap
          v-if="data.collection_status == 'public'"
          text="Виден всем"
        >
          <div class="flex gap-1">
            <Eye />
          </div>
        </TooltipWrap>
        <TooltipWrap
          v-else-if="data.collection_status == 'private'"
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
