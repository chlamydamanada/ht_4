import { refreshTokenMetaCollection } from "./db";

export const authRepository = {
  async createRefreshTokenMeta(device: any) {
    await refreshTokenMetaCollection.insertOne(device);
  },
  async updateRefreshTokenMeta(device: any) {
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
    return refreshTokenMeta;
  },
  async deleteRefreshTokenMeta(deviceId: string) {
    const isDel = await refreshTokenMetaCollection.deleteOne({
      deviceId: deviceId,
    });
    return isDel.deletedCount === 1;
  },
  async findAllDevices(userId: string) {
    const allDevices = await refreshTokenMetaCollection
      .find({ userId: userId })
      .toArray();
    console.log(allDevices);
    return allDevices.map((d) => ({
      ip: d.ip,
      title: d.title,
      lastActiveDate: new Date(d.lastActiveDate * 1000),
      deviceId: d.deviceId,
    }));
  },
};
