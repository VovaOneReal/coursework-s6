<script setup lang="ts">
import { Apple, Banana, Cherry, Citrus, Grape } from "lucide-vue-next";
import { onMounted, ref } from "vue";

const fruitType = ref(1);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

onMounted(() => {
  fruitType.value = getRandomInt(1, 5);
});
</script>

<template>
  <div class="flex h-full justify-center items-center">
    <div class="flex flex-col gap-2 justify-center items-center text-slate-400">
      <Banana class="w-10 h-10" v-if="fruitType == 1"></Banana>
      <Apple class="w-10 h-10" v-else-if="fruitType == 2"></Apple>
      <Cherry class="w-10 h-10" v-else-if="fruitType == 3"></Cherry>
      <Citrus class="w-10 h-10" v-else-if="fruitType == 4"></Citrus>
      <Grape class="w-10 h-10" v-else></Grape>
      <p class="empty-gag-p">Здесь ничего нет...</p>
    </div>
  </div>
</template>
