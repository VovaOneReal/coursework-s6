<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const props = defineProps(["text"]);
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <slot></slot>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ props.text }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
