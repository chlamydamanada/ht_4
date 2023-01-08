import { refreshTokenMetaCollection } from "./db";

export const authRepository = {
  async createRefreshTokenMeta(device: any): Promise<void> {
    await refreshTokenMetaCollection.insertOne(device);
  },
  async updateRefreshTokenMeta(device: any): Promise<boolean> {
    const result = await refreshTokenMetaCollection.updateOne(
      { deviceId: device.deviceId },
      {
        $set: {
          ip: device.ip,
          lastActiveDate: device.lastActiveDate,
          expirationDate: device.expirationDate,
        },
      }
    );

    return result.matchedCount === 1;
  },
  async findRefreshTokenMeta(deviceId: string) {
    const refreshTokenMeta = await refreshTokenMetaCollection.findOne({
      deviceId: deviceId,
    });

    if (refreshTokenMeta) {
      return {
        ip: refreshTokenMeta.ip,
        title: refreshTokenMeta.title,
        lastActiveDate: refreshTokenMeta.lastActiveDate,
        deviceId: refreshTokenMeta.deviceId,
      };
    } else {
      return false;
    }
  },
  async deleteRefreshTokenMeta(deviceId: string): Promise<boolean> {
    const isDel = await refreshTokenMetaCollection.deleteOne({
      deviceId: deviceId,
    });
    return isDel.deletedCount === 1;
  },
  async deleteALLRefreshTokenMetaByIdExceptMy(
    userId: string,
    deviceId: string
  ): Promise<boolean> {
    const isDel = await refreshTokenMetaCollection.deleteMany({
      userId: userId,
      deviceId: { $ne: deviceId },
    });
    return isDel.deletedCount === 1;
  },

  async findAllDevices(userId: string) {
    const allDevices = await refreshTokenMetaCollection
      .find({ userId: userId })
      .toArray();
    return allDevices.map((d) => ({
      ip: d.ip,
      title: d.title,
      lastActiveDate: new Date(d.lastActiveDate * 1000),
      deviceId: d.deviceId,
    }));
  },
  async findIsDeviceByDeviceId(deviceId: string) {
    const device = await refreshTokenMetaCollection.find({
      deviceId: deviceId,
    });
    console.log(device);
    return device;
  },
};
