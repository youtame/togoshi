<template>
    <v-container>
        <div class="comments-section">
            <h2 class="mb-3">サイトに関して</h2>

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
            <v-btn
                variant="flat"
                rounded="lg"
                class="main-button d-flex align-center font-weight-bold border-md"
                color="surface"
                elevation="0"
                rel="noopener"
                href="https://docs.google.com/forms/d/e/1FAIpQLSdyeRFBKR_QTMeqWeL5Fo7LkrVCtyPdEl4KSL9nPPcViuqP6A/viewform?usp=dialog"
                targiet="_blank"
            >
                お問い合わせはこちらから
            </v-btn>
        </div>
    </v-container>
</template>

<style scoped>
.comments-section {
    max-width: 1000px;
    margin: 60px auto;
    padding: 0 16px;
}

.main-button {
    margin: auto;
    margin-top: 30px;
    max-width: 480px;
    min-width: 220px;
    height: 90px;
    gap: 12px;
    padding: 0 25px;

    font-size: 17px;
    align-items: center;
    font-weight: 600;
    text-decoration: underline;
    transition: background-color 0.15s ease, box-shadow 0.15s ease;
}
</style>
