export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    // TODO: check if user is authetnicated and if user is admin
    return (
        <section>
            {children}
        </section>
    );
}