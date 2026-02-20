<template>
    <v-container>
        <div class="comments-section">
            <h2 class="mb-3">お問い合わせ</h2>

            <div class="site-container d-flex"></div>

            <v-list class="rounded-lg pa-3 mb-2 border-md">
                <v-list-item>
                    <v-list-item-content>
                        1. 以下の<span class="font-weight-semibold"
                            >Googleフォーム</span
                        >からご意見・ご要望・不具合報告などをお寄せください。
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content>
                        2.
                        下記のリンクをクリックしてフォームにアクセスしてください。フォームはこのサイトとは別のGoogleフォームのサイトで運営されているものです。
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>
        <v-row
            class="gap-4 mb-12"
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
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdyeRFBKR_QTMeqWeL5Fo7LkrVCtyPdEl4KSL9nPPcViuqP6A/viewform?usp=dialog"
                >
                    <v-icon
                        icon="mdi-comment-alert-outline"
                        class="mr-2"
                        size="large"
                        target="_blank"
                    ></v-icon>
                    お問い合わせへ
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
        </v-row>
    </v-container>
</template>

<style scoped>
.v-container {
    padding: 0px 0px 0px 0px !important;
}
.comments-section {
    max-width: 1000px;
    margin: 45px auto;
    margin-bottom: 30px;
}

.main-button {
    display: block;
    width: 100%;
    max-width: 1000px;
    min-width: 220px;
    height: 50px;
    gap: 12px;
    padding: 0 16px;

    font-size: 17px;
    font-weight: 600;
    text-align: center;
}
</style>
