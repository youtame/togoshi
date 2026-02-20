<template>
    <div class="All">
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
                        class="main-button d-flex align-center font-weight-bold border-md"
                        color="surface"
                        elevation="0"
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
                        class="main-button d-flex align-center font-weight-bold border-md"
                        color="surface"
                        elevation="0"
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
        <v-container class="notfound-section">
            <div class="text-center">
                <h1 class="text-h2 font-weight-bold mb-6">404</h1>
                <h2 class="headline font-weight-semibold mb-4">
                    ページが見つかりません
                </h2>
                <p class="body-large mb-6">
                    申し訳ございません。お探しのページは見つかりませんでした<br />
                    URLが間違っている可能性があります
                </p>
            </div>
            <Top />
        </v-container>
    </div>
</template>
<style scoped>
.v-container {
    padding: 0px 0px 0px 0px !important;
}

.All {
    min-height: 500px;
}

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
.notfound-section {
    max-width: 1000px;
    margin: 60px auto;
    margin-bottom: 30px;
}

h1 {
    font-size: 50px;
}
</style>
