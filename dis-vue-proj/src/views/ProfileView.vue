<script setup lang="ts">
import { onMounted, ref } from "vue";

import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import { CalendarClock, Filter, LogOut, Plus, Search } from "lucide-vue-next";

import RecipeDialog from "@/components/dialogs/RecipeDialog.vue";
import CollectionDialog from "@/components/dialogs/CollectionDialog.vue";

import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

import Toaster from "@/components/ui/toast/Toaster.vue";
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

import axios from "axios";

import RecipeCard from "@/components/RecipeCard.vue";
import CollectionCard from "@/components/CollectionCard.vue";
import DietCard from "@/components/DietCard.vue";
import EmptyGag from "@/components/EmptyGag.vue";

const userRole = ref("user");
const userLogin = ref(localStorage.getItem("ulogin"));

const userInfo = ref({
  login: null,
  collections: [],
  diets: [],
  recipes: [],
});

var reservedUserInfo = {
  login: null,
  collections: [],
  diets: [],
  recipes: [],
};

const searchQueries = ref({
  recipeSearch: "",
  collectionSearch: "",
  dietSearch: "",
});

function recipeSearch() {
  if (searchQueries.value.recipeSearch === "") {
    userInfo.value.recipes = [...reservedUserInfo.recipes];
  } else {
    var temp = [];
    for (var i = 0; i < reservedUserInfo.recipes.length; i++) {
      if (
        reservedUserInfo.recipes[i].recipe_name ===
        searchQueries.value.recipeSearch
      ) {
        temp.push(reservedUserInfo.recipes[i]);
      }
    }
    userInfo.value.recipes = temp;
  }
}

function collectionSearch() {
  if (searchQueries.value.collectionSearch === "") {
    userInfo.value.collections = [...reservedUserInfo.collections];
  } else {
    var temp = [];
    for (var i = 0; i < reservedUserInfo.collections.length; i++) {
      if (
        reservedUserInfo.collections[i].collection_name ===
        searchQueries.value.collectionSearch
      ) {
        temp.push(reservedUserInfo.collections[i]);
      }
    }
    userInfo.value.collections = temp;
  }
}

function dietSearch() {
  if (searchQueries.value.dietSearch === "") {
    userInfo.value.diets = [...reservedUserInfo.diets];
  } else {
    var temp = [];
    for (var i = 0; i < reservedUserInfo.diets.length; i++) {
      if (
        reservedUserInfo.diets[i].diet_name === searchQueries.value.dietSearch
      ) {
        temp.push(reservedUserInfo.diets[i]);
      }
    }
    userInfo.value.diets = temp;
  }
}

async function getUserInfo() {
  await axios
    .get(
      "http://localhost:3000/user?ulogin=" +
        route.params.ulogin +
        "&rlogin=" +
        localStorage.getItem("ulogin")
    )
    .then((response) => {
      userInfo.value = response.data;
      reservedUserInfo = JSON.parse(JSON.stringify(response.data));
    })
    .catch((err) => {
      toast({
        title: "Ошибка",
        description: err.response.data.message,
        variant: "destructive",
      });
      if (err.response.status == 404) {
        // Если мы не нашли чужую страницу, то возвращаемся на свою
        if (route.params.ulogin != localStorage.getItem("ulogin")) {
          router.push("/user/" + localStorage.getItem("ulogin")).then(() => {
            getUserInfo();
          });
        } else {
          // Если мы не нашли свою страницу - на авторизацию
          signout();
        }

        return;
      }
    });

  await axios
    .get(
      "http://localhost:3000/user/role?ulogin=" + localStorage.getItem("ulogin")
    )
    .then((response) => {
      localStorage.setItem("urole", response.data.role);
      userRole.value = localStorage.getItem("urole");
    });
}

async function goHome() {
  await router.push("/user/" + userLogin.value).then(() => {
    getUserInfo();
  });
}

async function deleteUser() {
  // TODO переместить логику удаления из темплейта сюда
  // TODO удалять ключ из локального хранилища, если удалили свой профиль (разлогинивать) сначала разлогиниваем, потом удаляем
  await axios
    .delete(
      "http://localhost:3000/user?ulogin=" +
        route.params.ulogin +
        "&rlogin=" +
        localStorage.getItem("ulogin")
    )
    .then((response) => {
      toast({
        title: "Успех",
        description: response.data.message,
      });
      router.push("/user/" + localStorage.getItem("ulogin"));
      getUserInfo();
      return;
    })
    .catch((err) => {
      toast({
        title: "Ошибка",
        description: err.response.data.message,
        variant: "destructive",
      });
    });
}

onMounted(async () => {
  if (!localStorage.getItem("ulogin")) {
    toast({
      title: "Доступ запрещён",
      description: "Вы не авторизованы.",
      variant: "destructive",
    });
    router.push("/login");
    return;
  }

  await getUserInfo();
});

function signout() {
  localStorage.removeItem("ulogin");
  router.push("/login");
}
</script>

<template>
  <Toaster />
  <div class="flex flex-col p-8 gap-8">
    <!-- Заголовок -->
    <div class="flex justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center">
          <h1 class="clickable" @click="goHome">FoodWorld</h1>
        </div>
        <div class="w-[2px] h-[24px] bg-slate-300"></div>
        <div
          v-if="userLogin == route.params.ulogin"
          class="text-slate-500 text-sm"
        >
          Здравствуйте, {{ userInfo.login }}!
        </div>
        <div v-else class="text-slate-500 text-sm">
          Профиль пользователя {{ userInfo.login }}
        </div>
      </div>
      <div class="flex gap-6">
        <Button
          variant="destructive"
          @click="deleteUser"
          v-if="userRole == 'admin'"
          >Удалить пользователя</Button
        >
        <RouterLink to="/ingredients">
          <Button variant="ghost" v-if="userRole == 'admin'"
            >Ингредиенты</Button
          >
        </RouterLink>
        <!-- <Button variant="ghost" @click="" v-if="userRole == 'admin'"
          >Пользователи</Button
        > -->
        <Button variant="outline" size="icon" @click="signout"
          ><LogOut
        /></Button>
      </div>
    </div>
    <!-- Рецепты -->
    <div class="flex flex-col gap-6">
      <div class="flex justify-between items-center">
        <div class="flex gap-4 items-center">
          <h2>Рецепты</h2>
          <!-- Диалог добавления рецепта -->
          <!-- TODO: поправить вёрстку, если какой-то рецепт растягивает строку -->
          <RecipeDialog @update-content="getUserInfo" operation-type="POST"
            ><Button v-if="userLogin == route.params.ulogin" size="icon"
              ><Plus class="w-4 h-4" /></Button
          ></RecipeDialog>
        </div>
        <div class="flex gap-4 items-center">
          <Input
            v-model:model-value="searchQueries.recipeSearch"
            @update:model-value="recipeSearch"
            class="max-w-[250px]"
            placeholder="Введите запрос..."
          ></Input>
          <!-- <Button class="px-2" size="icon" variant="outline"><Filter /></Button> -->
        </div>
      </div>
      <div v-if="userInfo.recipes.length > 0" class="grid grid-cols-4 gap-8">
        <RecipeCard
          v-for="recipe in userInfo.recipes"
          :key="recipe.recipe_id"
          :data="recipe"
          @update-content="getUserInfo"
        ></RecipeCard>
      </div>
      <EmptyGag v-else />
    </div>
    <!-- Коллекции -->
    <div class="flex flex-col gap-6">
      <div class="flex justify-between items-center">
        <div class="flex gap-4 items-center">
          <h2>Коллекции</h2>
          <CollectionDialog @update-content="getUserInfo">
            <Button v-if="userLogin == route.params.ulogin" size="icon"
              ><Plus class="w-4 h-4"
            /></Button>
          </CollectionDialog>
        </div>
        <div class="flex gap-4 items-center">
          <Input
            v-model:model-value="searchQueries.collectionSearch"
            @update:model-value="collectionSearch"
            class="max-w-[250px]"
            placeholder="Введите запрос..."
          ></Input>
        </div>
      </div>
      <div
        v-if="userInfo.collections.length > 0"
        class="grid grid-cols-4 gap-8"
      >
        <CollectionCard
          v-for="collection in userInfo.collections"
          :key="collection.collection_id"
          :data="collection"
          @update-content="getUserInfo"
        ></CollectionCard>
      </div>
      <EmptyGag v-else />
    </div>
    <!-- Планы питания -->
    <!-- <div class="flex flex-col gap-6">
      <div class="flex justify-between items-center">
        <div class="flex gap-4 items-center">
          <h2>Планы питания</h2>
          <Button size="icon"><Plus class="w-4 h-4" /></Button>
        </div>
        <div class="flex gap-4 items-center">
          <Input
            v-model:model-value="searchQueries.dietSearch"
            @update:model-value="dietSearch"
            class="max-w-[250px]"
            placeholder="Введите запрос..."
          ></Input>
          <Button class="px-2" size="icon" variant="outline"
            ><CalendarClock
          /></Button>
        </div>
      </div>
      <div v-if="userInfo.diets.length > 0" class="flex flex-col gap-5">
        <DietCard
          v-for="diet in userInfo.diets"
          :key="diet.diet_id"
          :data="diet"
        ></DietCard>
      </div>
      <EmptyGag v-else />
    </div> -->
  </div>
</template>
