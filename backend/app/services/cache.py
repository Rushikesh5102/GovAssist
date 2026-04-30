import json
import logging

logger = logging.getLogger(__name__)

# Fallback in-memory cache dictionary if real Redis is unavailable
_memory_cache = {}

try:
    import redis
    # Try to connect to Redis, timeout quickly if not running
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True, socket_connect_timeout=1)
    redis_client.ping()
    USE_REDIS = True
    logger.info("Successfully connected to Redis cache.")
except Exception as e:
    USE_REDIS = False
    logger.warning(f"Could not connect to Redis, falling back to in-memory cache. ({e})")

def get_cache(key: str):
    try:
        if USE_REDIS:
            val = redis_client.get(key)
            return json.loads(val) if val else None
        else:
            return _memory_cache.get(key)
    except Exception as e:
        logger.error(f"Cache get error: {e}")
        return None

def set_cache(key: str, value: dict, expire_seconds: int = 3600):
    try:
        if USE_REDIS:
            redis_client.setex(key, expire_seconds, json.dumps(value))
        else:
            _memory_cache[key] = value
    except Exception as e:
        logger.error(f"Cache set error: {e}")

def clear_cache_pattern(pattern: str):
    try:
        if USE_REDIS:
            keys = redis_client.keys(pattern)
            if keys:
                redis_client.delete(*keys)
        else:
            # Basic pattern matching for dict fallback (e.g., 'schemes:*')
            prefix = pattern.replace('*', '')
            keys_to_delete = [k for k in _memory_cache.keys() if k.startswith(prefix)]
            for k in keys_to_delete:
                del _memory_cache[k]
    except Exception as e:
        logger.error(f"Cache clear error: {e}")
