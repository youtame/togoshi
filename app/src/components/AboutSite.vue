<template>
    <v-card class="aboutsite-main-view rounded-lg">
        <v-card-title class="ma-1 text-h6 font-weight-semibold">
            <v-icon
                icon="mdi-information-box"
                size="small"
                class="pb-1"
            ></v-icon>
            <span class="pl-3">このページについて</span>
        </v-card-title>

        <v-expansion-panels>
            <v-expansion-panel>
                <v-expansion-panel-title>
                    タップして詳細を表示
                </v-expansion-panel-title>
                <v-expansion-panel-text class="ma-1">
                    <v-list dense>
                        <v-list-item>
                            <v-list-item-content>
                                1. ページ内容は1分ほどで自動更新されます
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                2.
                                取得しているAPIの都合上正確でないデータがある可能性があります
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                3.
                                このページが利用する公共交通データは、公共交通オープンデータセンターにおいて提供されるものです
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                4.
                                このページの表示内容について、公共交通事業者への直接の問合せは行わないでください。
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                5.
                                現在は車両の種類に関わらず全て同じ車両のアイコンが使用されます。
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-card>
</template>

<style scoped>
.aboutsite-main-view {
    margin-top: 30px;
    margin-bottom: 45px;
}
</style>
