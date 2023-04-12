<script setup>
import AddonCalculator from "@/components/AddonCalculator.vue";
</script>
<template>
    <div class="wrapper h-full flex justify-center">
        <div class="flex overflow-x-auto whitespace-nowrap h-full w-[100%] justify-center flex-col">
            <div class="flex ">
                <button
                    class="relative block items-center z-10 h-12 px-4 py-2 text-sm text-center text-gray-700 bg-white border-b border-gray-300 sm:text-base dark:border-gray-500 rounded-t-md dark:text-white whitespace-nowrap focus:outline-none"
                    :class="[active === 'AddonCalculator' ? 'border border-b-0 bg-spots-pattern  bg-repeat-round bg-[length:0.3rem_0.3rem]' : '']"
                    @click="() => setActiveTab('AddonCalculator')">
                    Addon Calculator
                </button>
                 <button
                    class="relative block items-center z-10 h-12 px-4 py-2 text-sm text-center text-gray-700 bg-white border-b border-gray-300 sm:text-base dark:border-gray-500 rounded-t-md dark:text-white whitespace-nowrap focus:outline-none"
                    :class="[active === 'PipCalculator' ? 'border border-b-0 bg-spots-pattern  bg-repeat-round bg-[length:0.3rem_0.3rem]' : '']"
                    @click="() => setActiveTab('PipCalculator')">
                    Pip Calculator
                </button>
            </div>

            <div
                class="w-full bg-spots-pattern h-[20em] left-0 z-0  bg-repeat-round bg-[length:0.3rem_0.3rem] border flex justify-center h-auto p-10">
                    <AddonCalculator v-if="active === 'AddonCalculator'"/>
                <div v-else-if="active === 'PipCalculator'">

                </div>
            </div>


        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active: "AddonCalculator"
        }
    },
methods: {
setActiveTab(tab) {
    this.active = tab;
}
},

    mounted() {
    }
}
</script>

