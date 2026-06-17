import SignInForm from "./SignInForm";

export default function AccountForm() {
    return (
        <main className="grow custom-container mx-auto flex flex-col justify-center text-center px-4 py-8">
            <section id="singin-form" className="w-max flex flex-col gap-4 text-center items-center justify-center self-center bg-(--sec-bg) rounded-2xl p-10">
                <h2 className="font-bold text-2xl">Segraph Best Chat Platform</h2>

                <SignInForm />
            </section>
        </main>
    )
}