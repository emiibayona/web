<template>
    <footer class="footer">
        <div class="footer-content">
            <p class="footer-text">
                Created by <a href="https://linkedin.com/in/emiliano-bayona/" target="_blank"
                    rel="noopener noreferrer">Emiliano Bayona</a>
            </p>
            <p class="footer-text">
                © <span id="year"></span> Wizards of the Coast. All rights reserved.
            </p>
        </div>
    </footer>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.footer {
    background-color: #1a1a2e;
    color: #e0e0e0;
    padding: 2rem 1rem;
    margin-top: 3rem;
    border-top: 1px solid #16213e;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}

.footer-text {
    margin: 0.5rem 0;
    font-size: 0.875rem;
    line-height: 1.6;

    a {
        color: #00d4ff;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
            color: #00f0ff;
            text-decoration: underline;
        }
    }
}
</style>