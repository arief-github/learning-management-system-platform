const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient()

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: 'Computer Science' },
                { name: 'Business' },
                { name: 'Design' },
                { name: 'Marketing' },
                { name: 'Health & Fitness' },
                { name: 'Personal Development' },
                { name: 'Photography' },
                { name: 'Music' },
                { name: 'Writing' },
                { name: 'Language Learning' }
            ]
        })
    } catch(e) {
        console.error("Error seeding the database categories:", e)
    } finally {
        await database.$disconnect()
    }
}

main()