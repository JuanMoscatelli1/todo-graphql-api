import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { TaskStatus } from '../src/tasks/domain/task-status.enum';
import { UserService } from '../src/user/application/user.service';
import { Role } from '../src/roles/domain/roles.enum';
import { CreateUserDTO } from '../src/user/application/user.create-user.dto';


describe('TaskResolver (e2e)', () => {
    let app: INestApplication;
    let userToken: string;
    let adminToken: string;
    let taskId: number;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        const userService = moduleRef.get(UserService);

        // Crear usuarios directo con el service (sin resolver GraphQL)
        // Admin
        await userService.create({
            username: 'admin',
            password: '1234',
            roles: [Role.ADMIN],
        } as CreateUserDTO);


        // login como admin ya existente
        const { body: adminLogin } = await graphqlRequest(app,
            `mutation {
                login(input: { username: "admin", password: "1234" }) {
                accessToken
                }
            }
        `);
        adminToken = adminLogin.data?.login?.accessToken;
        if (!adminToken) throw new Error('No existe el usuario admin');

        // registrar usuario normal
        await graphqlRequest(app,
            `mutation {
                register(input: {
                username: "testuser",
                password: "1234",
                roles: [USER]
                })
            }`, adminToken);

        // registrar usuario admin
        await graphqlRequest(app, `
            mutation {
                register(input: {
                username: "adminuser",
                password: "1234",
                roles: [ADMIN]
            })
        }`, adminToken);

        // login user normal
        const { body: loginUser } = await graphqlRequest(app,
            `mutation {
                login(input: { username: "testuser", password: "1234" }) {
                accessToken
                }
            } `);
        userToken = loginUser.data.login.accessToken;

        // login admin nuevo
        const { body: loginAdmin } = await graphqlRequest(app,
            `mutation {
                login(input: { username: "adminuser", password: "1234" }) {
                accessToken
                }
            }`);
        adminToken = loginAdmin.data.login.accessToken;
    });

    it('should create a task for user', async () => {
        const res = await graphqlRequest(app, `
            mutation {
                createTask(input: { title: "Tarea 1", description: "Descripcion" }) {
                    id
                    title
                }
            }`
            , userToken);

        expect(res.body.data.createTask.title).toBe('Tarea 1');
        taskId = res.body.data.createTask.id;
    });

    it('should get tasks for user', async () => {
        const res = await graphqlRequest(app, `
            query {
                tasksByUser {
                    id
                    title
                }
            }`
            , userToken);

        expect(res.body.data.tasksByUser.length).toBeGreaterThan(0);
    });

    it('should update task', async () => {
        const res = await graphqlRequest(app, `
            mutation {
                updateTask(input: {
                    taskId: ${taskId}
                    title: "Actualizada 1"
                    description: "Actualizada 1"
                }) {
                    title
                    description
                }
            }`
            , userToken);

        expect(res.body.data.updateTask.title).toBe('Actualizada 1');
    });

    it('should change task status', async () => {
        const res = await graphqlRequest(app, `
            mutation {
                changeTaskStatus(input: {
                    taskId: ${taskId}
                    action: START
                }) {
                    id
                    status
                }
            }
        `, userToken);

        expect(res.body.data.changeTaskStatus.status).toBe(TaskStatus.IN_PROGRESS);
    });


    it('should allow admin to see all tasks', async () => {
        const res = await graphqlRequest(app,
            `query {
                tasksForAdmin {
                    id
                    title
                    status
                }
            }`
            , adminToken);

        expect(res.body.data.tasksForAdmin.length).toBeGreaterThan(0);
    });

    it('should delete task', async () => {
        const res = await graphqlRequest(app, `
            mutation {
                deleteTask(taskId: ${taskId})
            }`
            , userToken);

        expect(res.body.data.deleteTask).toBe(true);
    });

    afterAll(async () => {
        await app.close();
    });
});

function graphqlRequest(app: INestApplication, query: string, token?: string) {
    const req = request(app.getHttpServer())
        .post('/graphql')
        .send({ query });

    if (token) req.set('Authorization', `Bearer ${token}`);
    return req;
}
