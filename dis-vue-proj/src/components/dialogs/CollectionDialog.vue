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

import { Checkbox } from "../ui/checkbox";

import Label from "../ui/label/Label.vue";
import Button from "../ui/button/Button.vue";
import Input from "../ui/input/Input.vue";

import { ref } from "vue";

import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

import axios from "axios";

const emit = defineEmits(["updateContent"]);

const isDialogOpen = ref(false);

const collectionData = ref({
  name: null,
  status: null,
});

async function saveCollection() {
  // Проверяем, что поля не пустые
  if (!collectionData.value.name) {
    toast({
      title: "Ошибка",
      description: "Укажите имя коллекции",
      variant: "destructive",
    });
    return;
  }

  var translatedStatus = "private";
  if (collectionData.value.status) {
    translatedStatus = "public";
  }

  await axios
    .post(
      "http://localhost:3000/collection?ulogin=" +
        localStorage.getItem("ulogin"),
      { name: collectionData.value.name, status: translatedStatus }
    )
    .then((response) => {
      toast({
        title: "Коллекция успешно добавлена",
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
  collectionData.value = {
    name: null,
    status: false,
  };
}
</script>

<template>
  <Dialog v-model:open="isDialogOpen" class="w-full">
    <DialogTrigger>
      <slot></slot>
    </DialogTrigger>
    <DialogContent
      class="min-w-[15%] max-w-[25%] max-h-[75%] overflow-y-scroll gap-8"
    >
      <DialogHeader>
        <DialogTitle>Создание коллекции</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col w-full gap-4">
        <div class="flex flex-col gap-2 w-full">
          <Label for="collectionName">Название коллекции</Label>
          <Input
            v-model:model-value="collectionData.name"
            id="collectionName"
            placeholder="Введите название..."
            maxlength="80"
          ></Input>
        </div>
        <div class="flex gap-2 w-full">
          <Checkbox v-model:checked="collectionData.status" id="publicity" />
          <Label for="publicity">Публичная?</Label>
        </div>
      </div>
      <DialogFooter class="items-center">
        <Button @click="saveCollection">Сохранить</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
