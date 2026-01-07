<template>
    <v-container>
        <div class="manager-section">
            <h2 class="mb-3">運営者について</h2>

            <div class="site-container d-flex"></div>

            <v-list class="rounded-lg pa-3 mb-2 border-md">
                <v-list-item>
                    <v-list-item-content>
                        このサイトをご利用いただきありがとうございます。このサイトは102℃が運営しています。　読み方は、10-2-doでten-two-doで鉄道の語呂合わせになっています。RetrationはReal-time
                        Train-Informationの略です。102℃の他のサービスについては<a
                            href="https://lozdo.com"
                            >こちら</a
                        >から。このサイトに関するお問い合わせは<a
                            class="normal-btn"
                            href="/retration2/comments"
                            >こちら</a
                        >からお願いいたします。
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>
        <v-row
            class="px-4 gap-4 mb-12"
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
                    href="/"
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
.manager-section {
    max-width: 1000px;
    margin: 60px auto;
    margin-bottom: 30px;
    padding: 0 16px;
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
