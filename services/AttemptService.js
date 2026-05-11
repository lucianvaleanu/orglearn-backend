const { UserProgress, sequelize } = require('../models');
const attemptRepository = require('../repositories/AttemptRepository');

class AttemptService {
  async startAttempt(userId, scenarioId) {
    const transaction = await sequelize.transaction();

    try {
      const existingProgress = await UserProgress.findOne({
        where: { user_id: userId, scenario_id: scenarioId },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      await attemptRepository.abandonInProgressAttempts(userId, scenarioId, transaction);

      const latestAttemptNumber = await attemptRepository.getLatestAttemptNumber(
        userId,
        scenarioId,
        transaction
      );
      const attemptNumber = latestAttemptNumber + 1;

      const attempt = await attemptRepository.createAttempt(
        userId,
        scenarioId,
        attemptNumber,
        transaction
      );

      const now = new Date();

      if (existingProgress) {
        await existingProgress.update(
          { status: 'in_progress', last_accessed_at: now },
          { transaction }
        );
      } else {
        await UserProgress.create(
          {
            user_id: userId,
            scenario_id: scenarioId,
            status: 'in_progress',
            last_accessed_at: now
          },
          { transaction }
        );
      }

      const action = this.getActionForStart(existingProgress, latestAttemptNumber);

      await transaction.commit();

      return {
        attemptId: attempt.id,
        attemptNumber: attempt.attempt_number,
        status: attempt.status,
        action
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async completeAttempt(userId, attemptId, score, status) {
    const transaction = await sequelize.transaction();

    try {
      const attempt = await attemptRepository.findByIdForUser(
        attemptId,
        userId,
        transaction
      );

      if (!attempt) {
        const error = new Error('Attempt not found');
        error.statusCode = 404;
        throw error;
      }

      const finalizedStatus = status || 'completed';
      const now = new Date();

      const updatedAttempt = await attemptRepository.updateAttempt(
        attemptId,
        {
          status: finalizedStatus,
          score,
          completed_at: now
        },
        transaction
      );

      const progressStatus = finalizedStatus === 'completed' ? 'completed' : 'in_progress';

      const progress = await UserProgress.findOne({
        where: { user_id: userId, scenario_id: attempt.scenario_id },
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (progress) {
        const updates = {
          status: progressStatus,
          last_accessed_at: now
        };

        if (finalizedStatus === 'completed') {
          updates.score = score;
        }

        await progress.update(updates, { transaction });
      } else {
        await UserProgress.create(
          {
            user_id: userId,
            scenario_id: attempt.scenario_id,
            status: progressStatus,
            score: finalizedStatus === 'completed' ? score : null,
            last_accessed_at: now
          },
          { transaction }
        );
      }

      await transaction.commit();

      return updatedAttempt;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  getActionForStart(existingProgress, latestAttemptNumber) {
    if (existingProgress && existingProgress.status === 'completed') {
      return 'Repeat';
    }

    if (latestAttemptNumber > 0) {
      return 'Redo';
    }

    return 'Start';
  }
}

module.exports = new AttemptService();
