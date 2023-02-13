import Router from 'koa-router';
import HelloController from './controller/hello';

const router = new Router();

router.get('/hello', HelloController.hello);
router.post('/sayHey', HelloController.sayHey);


export default router;