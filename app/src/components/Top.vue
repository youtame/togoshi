<template>
    <div class="top-main-view">
        <v-row
            class="gap-4"
            justify="start"
            direction="column"
            :md-direction="'row'"
        >
            <v-col>
                <v-btn
                    variant="flat"
                    rounded="lg"
                    class="main-button d-flex align-center font-weight-bold"
                    color="surface"
                    elevation="1"
                    rel="noopener"
                    to="/"
                >
                    <v-icon
                        icon="mdi-home-outline"
                        class="mr-2"
                        size="large"
                    ></v-icon>
                    ホームに戻る
                </v-btn></v-col
            >
            <v-col>
                <v-btn
                    variant="flat"
                    rounded="lg"
                    class="main-button d-flex align-center font-weight-bold"
                    color="surface"
                    elevation="1"
                    rel="noopener"
                    to="/comments"
                >
                    <v-icon
                        icon="mdi-comment-alert-outline"
                        class="mr-2"
                        size="large"
                        target="_blank"
                    ></v-icon>
                    お問い合わせ
                </v-btn></v-col
            >
        </v-row>
    </div>
</template>
<style scoped>
.top-main-view {
    margin-top: 45px;
}

.main-button {
    display: block;
    width: 100%;
    max-width: 1000px;
    min-width: 220px;
    height: 50px;
    gap: 12px;

    font-size: 17px;
    font-weight: 600;
    text-align: center;
}
</style>
