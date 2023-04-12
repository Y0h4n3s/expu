<template>
    <div class="">
        <div class="grid grid-cols-2 gap-10 mb-4">
            <form class="flex flex-col gap-3 min-w-[25em] max-w-[25em]">
                <div class="flex items-center mb-4">
                    <input @click=setShort id="short-radio-1" type="radio" v-bind:checked=!side name="short-radio"
                           class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="default-radio-1"
                           class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Short</label>
                </div>
                <div class="flex items-center mb-4">
                    <input @click=setLong id="long-radio-2" type="radio" v-bind:checked="side" name="long-radio"
                           class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                    <label for="default-radio-1"
                           class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Long</label>
                </div>
                <NumberInput v-model="entry" label="Entry" placeholderText="Entry price"/>
                <NumberInput v-model="stop" label="Stop Loss" placeholderText="Stop price"/>
                <NumberInput v-model="target" label="Target" placeholderText="Target price"/>
                <NumberInput v-model="initialSize" label="Initial Size" placeholderText="Initial Size"/>

                <div v-for="addon in addons">
                    <p>{{ addon.id }}.</p>
                    <div class="flex gap-2 justify-center items-end">
                        <NumberInput v-model=addon.price label="Price" placeholderText=""/>
                        <NumberInput v-model=addon.size label="Size" placeholderText=""/>
                        <MinusIcon @click=removeAddOn(addon.id) class="h-8 w-8 rounded-full cursor-pointer"/>
                    </div>

                </div>
            </form>
            <div class="flex flex-col gap-3 pl-5 min-w-[25em] max-w-[25em]">
                <p>Initial Max Loss: {{ Number.isNaN(maxInitialLoss()) ? "-" : maxInitialLoss() }}</p>
                <p>Initial Max Profit: {{ Number.isNaN(maxInitialProfit()) ? "-" : maxInitialProfit()  }}</p>
                <div v-for="addon in addons">
                    <p>{{ addon.id }}.</p>
                    <div class="grid grid-cols-2 gap-2 justify-center items-end">
                        <span>Adjusted Size: {{prettifyMoney(valuesAtIndex(addon.id)[1])}}</span>
                        <span>Adjusted Price: {{valuesAtIndex(addon.id)[0].toFixed(5)}}</span>
                        <span>Max Loss: {{loss(addon.id)}}</span>
                        <span>Max Profit: {{profit(addon.id)}}</span>

                    </div>

                </div>
            </div>
        </div>

        <ButtonSimple @click=appendAddOn content="Add"/>
    </div>
</template>

<script>
import ButtonSimple from "@/components/ButtonSimple.vue";
import NumberInput from "@/components/NumberInput.vue";
import {MinusIcon} from "@heroicons/vue/24/solid"

export default {
    components: {NumberInput, ButtonSimple, MinusIcon},
    data() {
        return {
            count: 0,
            addons: [],
            side: true,
            entry: 0,
            stop: 0,
            target: 0,
            initialSize: 0,
        }
    },
    methods: {
        appendAddOn() {
            this.addons.push({
                id: ++this.count,
                price: 0,
                size: 0,
            })
        },
        removeAddOn(id) {
            let count = 0;
            this.addons = this.addons.filter(addon => addon.id !== id).map(addon => {
                    addon.id = ++count;
                    return addon;
                }
            )
            this.count = count;


        },
        setLong() {
            this.side = true;
        },
        setShort() {
            this.side = false;
        },
        maxInitialLoss() {
            if (this.side) {
                return this.prettifyMoney((this.initialSize / this.entry * this.stop) - this.initialSize)
            } else {
                return this.prettifyMoney((this.initialSize / this.stop *  this.entry) - this.initialSize)

            }
        },

        maxInitialProfit() {
            if (this.side) {
                return this.prettifyMoney((this.initialSize / this.entry * this.target) - this.initialSize)
            } else {
                return this.prettifyMoney((this.initialSize / this.target *  this.entry) - this.initialSize)

            }
        },
loss(i) {
            let [entry, size] = this.valuesAtIndex(i)
            if (this.side) {
                return this.prettifyMoney((size / entry * this.stop) - size)
            } else {
                return this.prettifyMoney((size / this.stop *  entry) - size)

            }
        },

        profit(i) {
                    let [entry, size] = this.valuesAtIndex(i)

            if (this.side) {
                return this.prettifyMoney((size / entry * this.target) - size)
            } else {
                return this.prettifyMoney((size / entry *  this.entry) - size)

            }
        },

        valuesAtIndex(i) {
            if (this.addons.length < i) {
                return 0
            }
            let size = this.initialSize;
        let price = this.entry;
            for (let addon of this.addons) {
                if (addon.id > i) {
                break;
                }
                        price = (price * size + addon.price * addon.size) / (size + addon.size)

            size += addon.size;
            }
        return [price, size]

        },
        prettifyMoney(val) {
            return "$" + Number(val).toFixed(2)
        }
    },
    computed: {},

    mounted() {

    }
}

</script>