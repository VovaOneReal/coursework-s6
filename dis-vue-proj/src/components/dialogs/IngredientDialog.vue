<script setup lang="ts">
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-vue-next";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Label from "../ui/label/Label.vue";
import Button from "../ui/button/Button.vue";
import { onMounted, ref } from "vue";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";

import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

import axios from "axios";
import { clear } from "console";

// Список ингредиентов с сервера
const ingredientsList = ref([]);

// Возвращаемая информация о выбранном рецепте
const ingredientData = ref({
  name: null,
  amount: 1,
  measurement: "",
});

const isComboboxOpen = ref(false);
const isDialogOpen = ref(false);

const emit = defineEmits(["ingredientSet"]);

function addIngredient() {
  // Проверяем корректность ввода
  if (!ingredientData.value.name || !ingredientData.value.measurement) {
    toast({
      title: "Ошибка",
      description: "Выберите ингредиент и меру измерения",
      variant: "destructive",
    });
    return;
  } else {
    emit("ingredientSet", ingredientData.value);
    isDialogOpen.value = false;
    clearFields();
  }
}

function clearFields() {
  ingredientData.value = {
    name: null,
    amount: 1,
    measurement: "",
  };
}

onMounted(async () => {
  // TODO фильтровать ингредиенты, которые уже были добавлены в рецепт

  await axios.get("http://localhost:3000/ingredient").then((res) => {
    ingredientsList.value = res.data;
  });
});
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger>
      <slot></slot>
    </DialogTrigger>
    <DialogContent class="max-w-[33%] gap-8">
      <DialogHeader>
        <DialogTitle>Ингредиенты</DialogTitle>
        <DialogDescription
          >Введите название ингредиента, укажите меру измерения и количество, а
          затем нажмите «Подтвердить»</DialogDescription
        >
      </DialogHeader>
      <div class="flex justify-between gap-4 items-center">
        <div class="flex flex-col gap-2 w-full">
          <Label for="ingredientName">Ингредиент</Label>
          <!-- TODO: вариант текста, если не будет ингредиентов от сервера -->
          <Popover class="min-w-[150px] w-full" v-model:open="isComboboxOpen">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                role="combobox"
                :aria-expanded="isComboboxOpen"
                class="w-full justify-between"
              >
                {{
                  ingredientData.name
                    ? ingredientsList.find(
                        (ingredient) =>
                          ingredient.ingredient_name === ingredientData.name
                      )?.ingredient_name
                    : "Выберите ингредиент..."
                }}
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[200px] p-0">
              <Command>
                <CommandInput class="h-9" placeholder="Поиск ингредиента..." />
                <CommandEmpty>Ингредиент не найден.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      v-for="ingredient in ingredientsList"
                      :key="ingredient.ingredient_name"
                      :value="ingredient.ingredient_name"
                      @select="
                        (ev) => {
                          if (typeof ev.detail.value === 'string') {
                            ingredientData.name = ev.detail.value;
                          }
                          isComboboxOpen = false;
                        }
                      "
                    >
                      {{ ingredient.ingredient_name }}
                      <Check
                        :class="
                          cn(
                            'ml-auto h-4 w-4',
                            ingredientData.name === ingredient.ingredient_name
                              ? 'opacity-100'
                              : 'opacity-0'
                          )
                        "
                      />
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div class="flex flex-col gap-2 w-fit">
          <NumberField
            id="ingredientAmount"
            v-model:model-value="ingredientData.amount"
            :default-value="1"
            :min="1"
          >
            <Label for="ingredientAmount">Количество</Label>
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <Label for="ingredientMeasure">Мера измерения</Label>
          <Select
            id="ingredientMeasure"
            v-model:model-value="ingredientData.measurement"
          >
            <SelectTrigger>
              <SelectValue placeholder="Мера..." />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Меры измерений</SelectLabel>
                <SelectItem value="шт"> шт. </SelectItem>
                <SelectItem value="гр"> гр. </SelectItem>
                <SelectItem value="мл"> мл. </SelectItem>
                <SelectItem value="ч. л."> ч. л. </SelectItem>
                <SelectItem value="ст. л."> ст. л. </SelectItem>
                <SelectItem value="л"> л. </SelectItem>
                <SelectItem value="кг"> кг. </SelectItem>
                <SelectItem value="чашка"> чашка </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button @click="addIngredient">Подтвердить</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
