import {db} from "@/lib/db";
import { auth } from '@clerk/nextjs'
import {redirect} from "next/navigation";
import {IconBadge} from "@/components/icon-badge";
import {CircleDollarSign, LayoutDashboard, ListChecks, File} from "lucide-react";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";

const CourseIdPage = async ({ params }: {params: { courseId: string }}) => {
    // mengambil userId autentikasi dari auth next auth
    const { userId } = auth()

    // bila user id tidak ditemukan, maka redirect ke halaman utama
    if (!userId) {
        return redirect('/')
    }

    // mengambil course berdasarkan id melalui params
    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId
        },
        include: {
            attachments: {
                orderBy: {
                    createdAt: 'asc'
                }
            }
        }
    });

    // mengambil seluruh master data category
    const categories = await db.category.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    // bila course tidak ditemukan, maka kembalikan ke halaman utama
    if(!course) {
        return redirect('/')
    }

    // menampung item jenis inputan yang wajib diisi
    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ];

    // total keseluruhan fields
    const totalFields = requiredFields.length;

    // fields yang sudah kumplit diinpit
    const completedFields = requiredFields.filter(Boolean).length

    // fields yang sudah terisi, akan ditampilkan jumlahnya ke dalam UI (misal 1/5 input sudah diisi)
    const completionText = `(${completedFields} / ${totalFields})`

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-y-2'>
                    <h1 className='text-2xl font-medium'>
                        Course Setup
                    </h1>
                    <span className='text-sm text-slate-700'>
                        Complete all fields { completionText }
                    </span>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
                <div>
                    <div className='flex items-center gap-x-2'>
                        <IconBadge size='sm' variant='success' icon={LayoutDashboard} />
                        <h2 className='text-xl'>
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm initialData={course} courseId={course.id}/>
                    <DescriptionForm initialData={course} courseId={course.id}/>
                    <ImageForm initialData={course} courseId={course.id} />
                    <CategoryForm initialData={course} courseId={course.id} options={categories.map((category) => ({
                        label: category.name,
                        value: category.id
                    }))} />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className="flex flex-items-center gap-x-2">
                            <IconBadge size='sm' icon={ListChecks} />
                            <h2 className='text-xl'>
                                Course Chapters
                            </h2>
                        </div>
                        <div>
                            TODO: Chapters
                        </div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge size='sm' icon={CircleDollarSign} />
                            <h2 className='text-xl'>
                                Course Pricing
                            </h2>
                        </div>
                        <PriceForm initialData={course} courseId={course.id} />
                        
                        <div className="flex items-center gap-x-2">
                            <IconBadge size='sm' icon={File} />
                            <h2 className='text-xl'>
                                Resources & Attachments
                            </h2>
                        </div>
                        <AttachmentForm initialData={course} courseId={course.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseIdPage
