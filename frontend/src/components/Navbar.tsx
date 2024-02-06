import Link from "next/link"

export default function Navbar() {

    const handleThemeChange = () => {
        const html = document.querySelector('html')
        const theme = html?.getAttribute('data-bs-theme');
        if (theme === 'dark') {
            html?.setAttribute('data-bs-theme', 'light')
            //change background to white
        } else {
            html?.setAttribute('data-bs-theme', 'dark')
        }
    }

    return (
        <div>
            <nav className="d-flex justify-content-center py-3 navbar border-bottom">
                <Link href="/" className="navbar-brand btn btn-outline-light">Estoque</Link>
                <Link href="/armario" className="navbar-brand btn btn-outline-light">Armário</Link>
                {/* <button onClick={handleThemeChange}>Mudar Tema</button> */}
            </nav>
        </div>
    )
}