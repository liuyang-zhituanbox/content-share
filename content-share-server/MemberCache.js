const MEMBER_CACHE_PREFIX = "member_cache_";

function getMemberKey(key) {
    return MEMBER_CACHE_PREFIX + key + "_"+new Date().getTime();
}

/**
 * 成员缓存
 * 支持key中多个成员，并且独立ttl
 */
class CacheValue {
    constructor(value) {
        this.value = value;
        this.timestamp = new Date().getTime();
    }
}

class MemberCache {
    constructor(cache, key) {
        this.cache = cache;
        this.key = key;
    }

    /**
     * 添加
     * @param value 数据
     */
    async add(value) {
        await this.cache.set(getMemberKey(this.key), new CacheValue(value));
    }

    /**
     * 值
     * @returns {Promise<void>}
     */
    async values() {
        let keys = await this.cache.keys();
        let values = [];
        let memberKeyConstant = MEMBER_CACHE_PREFIX + this.key;
        for (let memberKey in keys) {
            // noinspection JSUnfilteredForInLoop
            if (memberKey.startsWith(memberKeyConstant)) {
                let cacheValue = await this.cache.get(memberKey);
                if (cacheValue !== undefined) {
                    values.push(cacheValue);
                }
            }
        }
        return values.sort((o, n) => {
            //倒序
            if (o.timestamp < n.timestamp) {
                return 1;
            } else if (o.timestamp > n.timestamp) {
                return -1;
            } else {
                return 0;
            }
        }).map(cacheValue => cacheValue.value);
    }
}

module.exports =   MemberCache;
