export interface FormProps {
    isLoggin: boolean;
    alert: {
        show: boolean;
        type: "success" | "error" | "loading";
        message: string;
    };
    setAlert: React.Dispatch<React.SetStateAction<{
        show: boolean;
        type: "success" | "error" | "loading";
        message: string;
    }>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    validateForm: (formData: FormData) => boolean;
}

export interface InputProbs {
    name: string;
    label: string;
    placeholder: string;
    type?: React.HTMLInputTypeAttribute;
    required?: boolean;
}