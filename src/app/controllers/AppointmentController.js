import { startOfHour, parseISO, isBefore } from 'date-fns';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';

class AppointmentController {
    async index(req, res) {
        const appintments = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            order: ['date'],
            attributes: ['id', 'date'],
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'uril'],
                        },
                    ],
                },
            ],
        });

        return res.json(appintments);
    }

    async store(req, res) {
        const { provider_id, date } = req.body;

        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true },
        });

        if (!isProvider) {
            return res
                .status(401)
                .json({ error: 'You can only appointments with providers' });
        }

        const hourStart = startOfHour(parseISO(date));

        if (isBefore(hourStart, new Date())) {
            return res
                .status(400)
                .json({ error: 'Past dates are not permitted' });
        }

        /**
         * Check date availability
         */

        const checkAvailability = await Appointment.findOne({
            provider_id,
            canceled_at: null,
            date: hourStart,
        });

        if (checkAvailability) {
            return res
                .status(401)
                .json({ error: 'Appoitment date is not available' });
        }

        const appointment = await Appointment.create({
            uder_id: req.userId,
            provider_id,
            date,
        });

        return res.json(appointment);
    }
}

export default new AppointmentController();
