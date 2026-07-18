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
        <v-container class="outofservice-section">
            <div class="text-center">
                <h1 class="text-h2 font-weight-bold mb-6">公開終了</h1>
                <h2 class="headline font-weight-semibold mb-4">
                    期間限定公開終了
                </h2>
                <p class="text-label-large mb-10">
                    <span class="font-weight-bold"
                        >このページはデータ引用元でのデータ公開が3月13日をもって終了したことに伴って、</span
                    ><br />
                    当ページもデータ公開が終了いたしました。<br />
                    お知らせの詳細は<v-btn
                        class="text-none text-decoration-underline font-weight-bold"
                        variant="text"
                        to="/information/202603140000"
                        >こちら</v-btn
                    >から
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
.outofservice-section {
    max-width: 1000px;
    margin: 60px auto;
    margin-bottom: 30px;
}

h1 {
    font-size: 50px;
}
</style>
