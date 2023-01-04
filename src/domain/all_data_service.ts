import { allDataRepository } from "../repositories/all_data_db_repository";

export const allDataService = {
  async deleteAllData(): Promise<void> {
    await allDataRepository.deleteAllData();
  },
};
