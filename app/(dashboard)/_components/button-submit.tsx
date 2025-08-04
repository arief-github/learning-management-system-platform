import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/shadcn-io/spinner";

interface ButtonSubmitProps {
    isValid: boolean
    isSubmitting: boolean
    buttonText?: string
}

const ButtonSubmit = ({ isValid, isSubmitting, buttonText }: ButtonSubmitProps) => (
    <Button
        disabled={!isValid || isSubmitting}
        type='submit'
    >
        { isSubmitting ? <Spinner/> : null }
        { buttonText ? buttonText : 'Save' }
    </Button>
)

export default ButtonSubmit