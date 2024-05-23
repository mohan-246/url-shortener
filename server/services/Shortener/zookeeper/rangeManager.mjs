import zookeeper from 'node-zookeeper-client';

const client = zookeeper.createClient('zoo1:2181,zoo2:2181,z003:2181'); 

const BASE_PATH = '/url_shortener';
const RANGE_SIZE = 10000;
const LOCK_PATH = `${BASE_PATH}/allocation_lock`;

client.once('connected', async () => {
    console.log('Connected to ZooKeeper.');
    try {
        await ensureBasePath();
        await resetRangeCounter()
        console.log('Ready to manage ranges.');
        
    } catch (error) {
        console.error('Failed to initialize: %s.', error);
    }
});

client.connect();

const resetRangeCounter = async () => {
    const path = `${BASE_PATH}/range_counter`;

    const nodeExists = await new Promise((resolve, reject) => {
        client.exists(path, (error, stat) => {
            if (error) {
                reject(`Failed to check existence of range counter: ${error}`);
            } else {
                resolve(!!stat);
            }
        });
    });

    if (!nodeExists) {
        await new Promise((resolve, reject) => {
            client.create(path, Buffer.from('0'), zookeeper.CreateMode.PERSISTENT, (createError) => {
                if (createError) {
                    reject(`Failed to create range counter node: ${createError}`);
                } else {
                    resolve();
                }
            });
        });
    } else {
        
        await new Promise((resolve, reject) => {
            client.setData(path, Buffer.from('0'), (setDataError) => {
                if (setDataError) {
                    reject(`Failed to reset range counter: ${setDataError}`);
                } else {
                    resolve();
                }
            });
        });
    }
};

const ensureBasePath = async () => {
    return new Promise((resolve, reject) => {
        client.mkdirp(BASE_PATH, (error) => {
            if (error) {
                reject(`Failed to create base path: ${BASE_PATH} due to: ${error}.`);
            } else {
                resolve();
            }
        });
    });
};

const allocateRange = async () => {
    const lock = await acquireLock();
    try {
        const nextValue = await getNextRangeCounter();
        const start = (nextValue - 1) * RANGE_SIZE;
        const end = start + RANGE_SIZE - 1;
        console.log("allocated range:" , start, end);
        return { start, end };
    } catch (error) {
        console.error('Failed to allocate range: %s.', error);
        throw error;
    } finally {
        releaseLock(lock);
    }
};

const getNextRangeCounter = async () => {
    const path = `${BASE_PATH}/range_counter`;

    const nodeExists = await new Promise((resolve, reject) => {
        client.exists(path, (error, stat) => {
            if (error) {
                reject(`Failed to check existence of range counter: ${error}`);
            } else {
                resolve(!!stat);
            }
        });
    });

    if (!nodeExists) {
        await new Promise((resolve, reject) => {
            client.create(path, Buffer.from('0'), zookeeper.CreateMode.PERSISTENT, (createError) => {
                if (createError) {
                    reject(`Failed to create range counter node: ${createError}`);
                } else {
                    resolve();
                }
            });
        });
        return 1; 
    }

    const data = await new Promise((resolve, reject) => {
        client.getData(path, (error, data) => {
            if (error) {
                reject(`Failed to get range counter: ${error}`);
            } else {
                resolve(data);
            }
        });
    });

    const currentValue = parseInt(data.toString('utf8'));
    const nextValue = currentValue + 1;

    await new Promise((resolve, reject) => {
        client.setData(path, Buffer.from(nextValue.toString()), (setDataError) => {
            if (setDataError) {
                reject(`Failed to update range counter: ${setDataError}`);
            } else {
                resolve();
            }
        });
    });

    return nextValue;
};

const acquireLock = async () => {
    return new Promise((resolve, reject) => {
        client.create(LOCK_PATH, zookeeper.CreateMode.EPHEMERAL, (error, path) => {
            if (error) {
                reject(`Failed to acquire lock: ${error}`);
            } else {
                resolve(path);
            }
        });
    });
};

const releaseLock = (lockPath) => {
    client.remove(lockPath, (error) => {
        if (error) {
            console.error(`Failed to release lock: ${error}`);
        } else {
            console.log('Lock released successfully.');
        }
    });
};

export { allocateRange };
