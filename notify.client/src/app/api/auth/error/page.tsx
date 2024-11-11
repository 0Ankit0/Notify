"use client"
import { useRouter } from 'next/router';

export default function ErrorPage() {
    const router = useRouter();
    const { error } = router.query;

    return (
        <div>
            <h1>Sign In Error</h1>
            {error && <p>{error}</p>}
            <p>Please try again.</p>
        </div>
    );
}
