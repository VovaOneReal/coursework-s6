<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RouterLink } from "vue-router";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
import axios from "axios";
import { ref } from "vue";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

import { md5 } from "js-md5";

const login = ref("");
const password = ref("");

function register() {
  if (!login.value || !password.value) {
    toast({
      title: "Ошибка",
      description: "Поля логина или пароля пустые.",
      variant: "destructive",
    });
    return;
  }

  if (password.value.length < 8) {
    toast({
      title: "Ошибка",
      description: "Пароль должен быть из 8 и более символов.",
      variant: "destructive",
    });
    return;
  }

  const requestBody = {
    login: login.value,
    password: md5(password.value),
  };

  axios
    .post("http://localhost:3000/registration", requestBody)
    .then((response) => {
      localStorage.setItem("ulogin", response.data.ulogin);
      router.push("/user/" + response.data.ulogin);
    })
    .catch((err) => {
      if (err.response) {
        toast({
          title: "Ошибка",
          description: err.response.data.message,
          variant: "destructive",
        });
      }
    });
}
</script>

<template>
  <Toaster />
  <div class="h-full bg-[url('/register-bg.png')] bg-cover">
    <div
      class="max-w-[25%] min-w-[400px] p-8 flex flex-col gap-8 h-full justify-center bg-slate-50"
    >
      <h1 class="text-center">FoodWorld</h1>
      <div class="flex flex-col gap-8">
        <h2 class="text-center">Регистрация</h2>
        <div class="flex flex-col gap-6">
          <div>
            <Label for="login">Логин</Label>
            <Input
              v-model:model-value="login"
              id="login"
              placeholder="Введите логин..."
            ></Input>
          </div>
          <div>
            <Label for="password">Пароль</Label>
            <Input
              v-model:model-value="password"
              id="password"
              type="password"
              placeholder="Введите пароль..."
            ></Input>
          </div>
        </div>
      </div>
      <div class="flex w-full justify-between">
        <RouterLink to="/login">
          <Button variant="ghost">Войти</Button>
        </RouterLink>
        <Button @click="register">Зарегистрироваться</Button>
      </div>
    </div>
  </div>
</template>
