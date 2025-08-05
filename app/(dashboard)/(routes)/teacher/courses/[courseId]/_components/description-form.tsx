"use client";

import * as z from 'zod';
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { Form, FormControl, FormField, FormMessage, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {Pencil} from "lucide-react";
import {useState} from "react";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation'
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {Spinner} from "@/components/ui/shadcn-io/spinner";
import ButtonSubmit from "@/app/(dashboard)/_components/button-submit";
import { Course } from '@prisma/client';

interface DescriptionProps {
    initialData: Course,
    courseId: string
}

const formSchema = z.object({
    description: z.string().min(1, {
        message: 'Description is Required'
    })
})

const DescriptionForm = ({ courseId, initialData }: DescriptionProps) => {
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const toggleEdit = () => setIsEditing((current) => !current)

    type FormValues = z.infer<typeof formSchema>

    const defaultValues: Partial<FormValues> = {
        description: initialData?.description || ""
    }

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: 'onChange'
    })

    const { isSubmitting ,isValid} = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course updated")
            toggleEdit()
            router.refresh()
        } catch (e) {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className='mt-6 border bg-slate-100 rounded-md p-4'>
            <div className='font-medium flex items-center justify-between'>
                Course Description
                <Button onClick={toggleEdit} variant='ghost'>
                    {isEditing ? (<p>Cancel</p>): (<><Pencil className='h-4 w-4 mr-2' /> Edit Description </>)}
                </Button>
            </div>
            {
                !isEditing ? (
                    <p className={cn("text-sm mt-2", !initialData.description && 'text-slate-500 italic')}>
                        {initialData.description || 'No Description'}
                    </p>
                ) : null
            }
            {
                isEditing ? (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-4 mt-4'
                        >
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea disabled={isSubmitting} placeholder="e.g. 'This course is about'" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex items-center gap-x-2'>
                                <ButtonSubmit isValid={isValid} isSubmitting={isSubmitting} />
                            </div>
                        </form>
                    </Form>
                ) : null
            }
        </div>
    );
};

export default DescriptionForm;