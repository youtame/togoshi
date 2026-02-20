<template>
    <v-container>
        <div class="manager-section">
            <h2 class="mb-3">運営者について</h2>

            <div class="site-container d-flex"></div>

            <v-list class="rounded-lg pa-3 mb-2 border-md">
                <v-list-item>
                    <v-list-item-content>
                        当サイトをご利用いただき、ありがとうございます。
                        本サイトは 102℃ が運営しています。
                        102℃（読み方：10-2-do／ten-two-do）は、「鉄道」を語呂合わせした名称です。
                        Retration は Real-time Train Information の略で、
                        列車の位置情報をより身近に、分かりやすくお伝えするサービスです。
                        102℃の他のサービスについては
                        <a href="https://lozdo.com">こちら</a>、
                        本サイトに関するお問い合わせは
                        <a class="normal-btn" href="/retration2/comments"
                            >こちら</a
                        >
                        よりお願いいたします。
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

.manager-section {
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

    font-size: 17px;
    font-weight: 600;
    text-align: center;
}
</style>
