import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [ScheduleModule.forRoot(), AuthModule],
    providers: [CronService],
    exports: [CronService],
})
export class CronModule { }