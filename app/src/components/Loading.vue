<template>
    <div class="loading-wrapper">
        <div class="spinner"></div>
        <p class="loading-text">Loading...</p>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(0, 250, 154, 0.25);
    border-top-color: #00fa9a;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
}

.loading-text {
    margin-top: 12px;
    font-size: 0.9rem;
    letter-spacing: 0.05em;
    color: #00fa9a;
    opacity: 0.8;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
