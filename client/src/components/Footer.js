import styles from '@/styles/footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer} >
            <p>© {new Date().getFullYear()} Sklep komputerowy. Wszelkie prawa zastrzeżone.</p>
        </footer>
    );
}

export default Footer;