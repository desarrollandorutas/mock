import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { User } from "@prisma/client";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class CronService {

    private readonly logger = new Logger(CronService.name);

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        const listUsers: User[] = await this.authService.getListInactiveAccount();
        const listPremiumuser: User[] = await this.authService.getListPremiumAccount();
        const usersStatusAndDeleteDate = listUsers.map(user => ({
            status: user.status,
            deleteDate: user.deleteDate,
            id: user.id,
            name: user.name
        }));

        const premiumUsersStatusAndSubscriptionDate = listPremiumuser.map(user => ({
            status: user.status,
            subscriptionDate: user.suscriptionDate,
            id: user.id,
            name: user.name
        }));

        const now = new Date();
        const deleteList: string[] = [];
        const cancelPremiumList: string[] = [];

        usersStatusAndDeleteDate.forEach(item => {
            if (item.deleteDate <= now) {
                this.logger.log(`elimina: ${item.name}`);
                deleteList.push(item.id);
            } else {
                this.logger.log(`no se elimina: ${item.name}`);
            }
        });

        premiumUsersStatusAndSubscriptionDate.forEach(item => {
            if (item.subscriptionDate <= now) {
                this.logger.log(`cancela premium: ${item.name}`);
                cancelPremiumList.push(item.id);
            } else {
                this.logger.log(`no cancela premium: ${item.name}`);
            }
        });

        if (deleteList.length !== 0) {
            const result = await this.authService.deleteUsers(deleteList);
            this.logger.log(`se eliminaron ${result} usuario/s`)
        }

        if (cancelPremiumList.length !== 0) {
            const result = await this.authService.cancelPremiumUsers(cancelPremiumList);
            this.logger.log(`se cancelaron ${result} usuario/s premium`)
        }

    }
}